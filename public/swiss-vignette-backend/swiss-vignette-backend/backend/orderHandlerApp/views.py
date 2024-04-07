import logging
import os

from django.conf import settings
from django.http import HttpResponse
from drf_spectacular.utils import extend_schema, inline_serializer
from rest_framework import serializers, status, views
from rest_framework.response import Response

from . import stripe_utils
from .serializers import (
    CreateOrderSerializer,
    OrderDetailsSerializer,
    ProductCombinationSerializer,
    ProductSerializer,
)
from .utils import PrestaUtils

logger = logging.getLogger(__name__)

presta_utils = PrestaUtils()


class VehicleRegistrationCountryListAPI(views.APIView):
    @extend_schema(
        responses={
            (200, "application/json"): {"type": "array", "items": {"type": "string"}}
        }
    )
    def get(self, request):
        """
        Gets the list of vehicle registration countries
        """

        all_countries = presta_utils.vehicle_registration_countries

        return Response(all_countries, status=status.HTTP_200_OK)


class ProductListAPI(views.APIView):
    serializer_class = ProductSerializer

    def get(self, request):
        """
        Gets supported vehicles data in a country that customers can buy vignette for.
        """

        products = presta_utils.get_all_products()
        return Response(products, status=status.HTTP_200_OK)


class ProductByIdAPI(views.APIView):
    serializer_class = ProductCombinationSerializer

    def get(self, request, product_id):
        """
        Gets product data for a given product_id
        """

        product = presta_utils.get_record_data(
            "products", product_id, options={"display": "full"}
        )
        if not product:
            return Response("Invalid product_id", status=status.HTTP_400_BAD_REQUEST)
        else:
            product = product["product"]
        image_id = presta_utils.download_image(
            product_id, product["id_default_image"]["value"]
        )

        vignette_types = presta_utils.get_product_combinations(product, need_img=False)
        vt_with_price = stripe_utils.get_prices_from_stripe(vignette_types)

        product_data = {
            "product_id": product["id"],
            "name": presta_utils.get_name_lang_dict(product["name"]),
            "image_id": image_id,
            "combinations": vt_with_price,
        }

        return Response(product_data, status=status.HTTP_200_OK)


class CreateOrderAPI(views.APIView):
    @extend_schema(
        request=CreateOrderSerializer,
        responses={
            (200, "application/json"): {"type": "string"},
        },
    )
    def post(self, request):
        """
        Create an order on Prestashop for the given customer
        Returns Stripe's checkout url if successful
        """

        order_serializer = CreateOrderSerializer(data=request.data)

        if order_serializer.is_valid():
            order_id = presta_utils.place_order(order_serializer.data)

            if order_id:
                try:
                    combination_id = order_serializer.data["combination_id"]
                    checkout_url = stripe_utils.get_stripe_checkout_url(
                        combination_id, order_serializer.data["currency"], order_id
                    )

                    return Response(checkout_url, status=status.HTTP_200_OK)

                except Exception:
                    logger.exception(f"Error with Stripe - {order_id}")

            return Response(None, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        else:
            # If data is not valid, return the validation errors
            return Response(order_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PaymentStatusAPI(views.APIView):
    serializer_class = OrderDetailsSerializer

    @extend_schema(
        request=inline_serializer(
            name="PaymentStatusSerializer",
            fields={"session_id": serializers.CharField()},
        )
    )
    def put(self, request):
        """
        Get Payment Status & Order Data. Update payment status on Presta.
        Returns order details.
        """

        session = stripe_utils.get_stripe_checkout_session(
            request.data.get("session_id")
        )
        if session:
            order_data = presta_utils.get_record_data(
                "orders", session["client_reference_id"]
            )
            order_details = presta_utils.get_order_details(order_data["order"])
            order_details[
                "total_paid"
            ] = f"{session.currency.upper()} {session.amount_total/100:.2f}"

            if session.payment_status == "paid":
                order_data["order"]["current_state"] = presta_utils.config[
                    "PRESTA_STATUS"
                ]["payment_confirmation"]
                order_details["payment_status"] = True
            else:
                order_data["order"]["current_state"] = presta_utils.config[
                    "PRESTA_STATUS"
                ]["payment_cancelled"]

            presta_utils.edit_record("orders", order_data)

            return Response(order_details, status=status.HTTP_200_OK)
        else:
            return Response(
                "Invalid data - session_id", status=status.HTTP_400_BAD_REQUEST
            )


class RefreshAPI(views.APIView):
    @extend_schema(responses={(200, "application/json"): {"type": "boolean"}})
    def get(self, request):
        """
        reloads cache data(countries) from Presta
        """

        presta_utils.refresh()

        return Response(True, status=status.HTTP_200_OK)


class GetImageAPI(views.APIView):
    @extend_schema(
        responses={(200, "image/png"): {"type": "string", "format": "binary"}}
    )
    def get(self, request, image_id):
        """
        serve image files
        """

        file_path = os.path.join(settings.STATIC_ROOT, f"images/{image_id}.png")

        with open(file_path, "rb") as file:
            return HttpResponse(file.read(), content_type="image/png")
