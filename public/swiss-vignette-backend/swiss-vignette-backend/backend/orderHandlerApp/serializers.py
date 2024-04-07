from rest_framework import serializers

from .models import Combination, CreateOrder, Customer, OrderDetails, Product


class CustomerSerializer(serializers.ModelSerializer):
    last_name = serializers.SerializerMethodField()

    def get_last_name(self, obj):
        return getattr(obj, "last_name", ".")

    class Meta:
        model = Customer
        fields = ("first_name", "last_name", "email")


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ("product_id", "name", "subtitle", "description", "image_id")


class CombinationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Combination
        fields = ("combination_id", "name", "price", "eko_fees", "image_id")


class ProductCombinationSerializer(serializers.ModelSerializer):
    combinations = CombinationSerializer(many=True)

    class Meta:
        model = Product
        fields = ("product_id", "name", "image_id", "combinations")


class CreateOrderSerializer(serializers.ModelSerializer):
    customer = CustomerSerializer()

    currency = serializers.SerializerMethodField()

    def get_currency(self, obj):
        return getattr(obj, "currency", "CHF")

    class Meta:
        model = CreateOrder
        fields = (
            "currency",
            "product_id",
            "combination_id",
            "vehicle_registration_country",
            "license_plate",
            "start_date",
            "customer",
        )


class CustomizationSerializer(serializers.ModelSerializer):
    class Meta:
        model = CreateOrder
        fields = (
            "vehicle_registration_country",
            "license_plate",
            "start_date",
        )


class OrderDetailsSerializer(serializers.ModelSerializer):
    customer = CustomerSerializer()
    customization = CustomizationSerializer()

    class Meta:
        model = OrderDetails
        fields = (
            "order_id",
            "reference_id",
            "total_paid",
            "payment_status",
            "customer",
            "customization",
            "product",
            "combination",
        )
