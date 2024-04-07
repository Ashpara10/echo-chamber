import json
import logging
import os

import requests
from bs4 import BeautifulSoup
from django.conf import settings
from prestapyt import PrestaShopWebServiceDict

from .decorators import ErrorHandler

logger = logging.getLogger(__name__)


class PrestaUtils(metaclass=ErrorHandler):
    def __init__(self):
        self.config = json.load(open(os.path.join(settings.STATIC_ROOT, "config.json")))

        self.prestashop_client = PrestaShopWebServiceDict(
            self.config["PRESTA_SHOP_API_URL"], self.config["PRESTA_SHOP_API_KEY"]
        )

        self.all_languages = {}
        self.vehicle_registration_countries = []

        self.currency_id = None
        self.lang_id = None

        self.refresh()

    def get_all_record_ids(self, resource) -> list:
        """
        Gets list of all record ids for a resource on Presta.
        """
        return self.prestashop_client.search(resource)

    def get_all_records(self, resource, options=None) -> list:
        """
        Gets data of all records in a resource on Presta.
        """
        return self.prestashop_client.get(resource, options=options)

    def get_record_data(self, resource, resource_id, options=None):
        """
        Gets a records's data in a resource from Presta.
        Resource could be - products, addresses
        """
        return self.prestashop_client.get(
            resource, resource_id=resource_id, options=options
        )

    def get_default_record_id(self, resource):
        return self.prestashop_client.search(resource)[0]

    def get_schema(self, resource):
        """
        Gets blank schema of a resource from Presta
        """
        return self.prestashop_client.get(resource, options={"schema": "blank"})

    def create_record(self, resource, resource_data):
        """
        Create a record of the resource on Presta
        """

        return self.prestashop_client.add(resource, resource_data)

    def edit_record(self, resource, record_data):
        """
        Update a records's data in a resource in Presta.
        """
        return self.prestashop_client.edit(resource, record_data)

    def refresh(self):
        """
        sets/updates defaults and categories + languages supported
        """

        self.currency_id = self.get_default_record_id("currencies")
        self.lang_id = self.get_default_record_id("languages")

        self.refresh_vehicle_registration_countries()
        self.refresh_languages()

    def refresh_languages(self):
        """
        Creates a dict mapping language id to iso code
        """

        response = self.get_all_records(
            "languages", options={"display": "[id,iso_code]"}
        )["languages"]["language"]
        languages = [response] if not isinstance(response, list) else response

        for language in languages:
            self.all_languages[language["id"]] = language["iso_code"]

        return

    def get_name_lang_dict(self, name_data: dict) -> dict:
        """
        Util to provide dict for the same text in different languages with iso_code as keys
        """

        name_lang_dict = {}
        for lang_data in name_data["language"]:
            lang_id = lang_data["attrs"]["id"]
            lang_iso = self.all_languages[lang_id]

            name_lang_dict[lang_iso] = (
                BeautifulSoup(lang_data["value"], "html.parser").get_text().strip()
            )

        return name_lang_dict

    def refresh_vehicle_registration_countries(self):
        """
        Refreshes feature values for the feature "Vehicle Registration Country"
        """

        features_data = self.get_all_records(
            "product_features", options={"display": "[id,name]"}
        )["product_features"]

        if isinstance(features_data["product_feature"], list):
            for feature in features_data["product_feature"]:
                if (
                    feature["name"]["language"][0]["value"]
                    == "Vehicle Registration Country"
                ):
                    feature_id = feature["id"]
                    break
        else:
            feature_id = features_data["product_feature"]["id"]

        feature_values_data = self.get_all_records(
            "product_feature_values",
            options={"display": "[value]", "filter[id_feature]": feature_id},
        )

        self.vehicle_registration_countries = []
        for feature_value in feature_values_data["product_feature_values"][
            "product_feature_value"
        ]:
            self.vehicle_registration_countries.append(
                feature_value["language"][0]["value"]
            )

        return

    def download_image(self, product_id, image_id):
        """
        Gets presta's image url from product_id & image_id and stores locally
        """

        file_path = os.path.join(settings.STATIC_ROOT, f"images/{image_id}.png")

        if not os.path.exists(file_path):
            image_url = f"{self.config['PRESTA_SHOP_API_URL']}/images/products/{product_id}/{image_id}"

            resp = requests.get(
                image_url, auth=(self.config["PRESTA_SHOP_API_KEY"], ""), verify=False
            )

            with open(file_path, "wb") as f:
                f.write(resp.content)

        return image_id

    def get_all_products(self) -> list:
        """
        Gets all products from Presta
        """
        products_data = self.get_all_records(
            "products",
            options={
                "display": "[id,name,id_default_image,description,description_short]",
            },
        )["products"]["product"]
        products_data = (
            [products_data] if not isinstance(products_data, list) else products_data
        )

        products = []
        for product in products_data:
            products.append(
                {
                    "product_id": product["id"],
                    "name": self.get_name_lang_dict(product["name"]),
                    "subtitle": self.get_name_lang_dict(product["description_short"]),
                    "description": self.get_name_lang_dict(product["description"]),
                    "image_id": self.download_image(
                        product["id"], product["id_default_image"]["value"]
                    ),
                }
            )

        return products

    def get_option_value_name(self, product_option_value_id) -> dict:
        """
        Gets product_option_value name from its id
        """

        option = self.get_record_data(
            "product_option_values",
            product_option_value_id,
            options={"display": "[name]"},
        )

        return self.get_name_lang_dict(option["product_option_value"]["name"])

    def get_combination_data(self, product_id, combination_id, need_img=False):
        """
        Gets data of a given combination of a product
        """

        combination = self.get_record_data(
            "combinations", combination_id, options={"display": "full"}
        )["combination"]

        product_option_value_id = combination["associations"]["product_option_values"][
            "product_option_value"
        ]["id"]
        vignette_type = self.get_option_value_name(product_option_value_id)

        image_id = None
        if need_img:
            image_id = self.download_image(
                product_id, combination["associations"]["images"]["image"]["id"]
            )

        combination_data = {
            "combination_id": combination_id,
            "name": vignette_type,
            "price": combination["price"],
            "image_id": image_id,
        }

        return combination_data

    def get_product_combinations(self, product_data, need_img=False) -> list:
        """
        Gets all the combinations of a product from its product_data
        """

        combinations = []

        comb_data = product_data["associations"]["combinations"]["combination"]
        if not isinstance(comb_data, list):
            product_combination_ids = [comb_data["id"]]
        else:
            product_combination_ids = [option["id"] for option in comb_data]

        for product_combination_id in product_combination_ids:
            combination_data = self.get_combination_data(
                product_data["id"], product_combination_id, need_img=need_img
            )
            combinations.append(combination_data)

        return combinations

    def get_or_create_customer(self, customer_data):
        """
        Returns customer_id as per Presta
        creates a new customer if no customer with that email exists
        """

        customers_data = self.get_all_records(
            "customers", options={"filter[email]": customer_data["email"]}
        )["customers"]

        if customers_data:
            if isinstance(customers_data["customer"], list):
                customer_id = customers_data["customer"][0]["attrs"]["id"]
            else:
                customer_id = customers_data["customer"]["attrs"]["id"]
            return customer_id
        else:
            customer = self.get_schema("customers")
            customer["customer"].update(
                {
                    "firstname": customer_data["first_name"],
                    "lastname": customer_data["last_name"],
                    "email": customer_data["email"],
                    "passwd": "12345678",
                    "active": "1",
                }
            )
            response = self.create_record("customers", customer)

            return response["prestashop"]["customer"]["id"]

    def get_or_create_default_address(self, customer_data, customer_id):
        """
        Gets or creates a default address for the customer
        """

        addresses_data = self.get_all_records(
            "addresses", options={"filter[id_customer]": customer_id}
        )["addresses"]

        if addresses_data:
            if isinstance(addresses_data["address"], list):
                address_id = addresses_data["address"][0]["attrs"]["id"]
            else:
                address_id = addresses_data["address"]["attrs"]["id"]
            return address_id
        else:
            address = self.get_schema("addresses")
            address["address"].update(
                {
                    "id_customer": customer_id,
                    "id_country": 17,
                    "alias": "Default",
                    "firstname": customer_data["first_name"],
                    "lastname": customer_data["last_name"],
                    "city": "Default",
                    "address1": "Default",
                }
            )
            response = self.create_record("addresses", address)

            return response["prestashop"]["address"]["id"]

    def create_cart(self, product_data, customer_id, address_id):
        """
        Creates cart by adding product to it
        """

        cart = self.get_schema("carts")

        cart["cart"].update(
            {
                "id_currency": self.currency_id,
                "id_lang": self.lang_id,
                "id_customer": customer_id,
                "delivery_option": f'{{"{address_id}":"1,"}}',
                "id_address_delivery": address_id,
                "id_address_invoice": address_id,
            }
        )

        cart["cart"]["associations"]["cart_rows"]["cart_row"].update(
            {
                "id_product": product_data["product_id"],
                "id_product_attribute": product_data["combination_id"],
                "quantity": 1,
            }
        )

        cart_data = self.create_record("carts", cart)

        return cart_data["prestashop"]["cart"]["id"]

    def create_customization(self, product_data, cart_id, address_id):
        """
        Create customization object as per order details to use when adding product to cart.
        """

        # get customization fields in that product and fill it to create customization
        customization_fields = self.get_all_records(
            "product_customization_fields",
            options={
                "display": "[id,name]",
                "filter[id_product]": product_data["product_id"],
            },
        )

        custom_fields = []
        for field in customization_fields["customization_fields"][
            "customization_field"
        ]:
            custom_fields.append(
                {
                    "id_customization_field": field["id"],
                    "value": product_data[
                        field["name"]["language"][0]["value"].replace(" ", "_").lower()
                    ],
                }
            )

        # creating customization
        customization = self.get_schema("customizations")

        customization["customization"].update(
            {
                "id_product": product_data["product_id"],
                "id_product_attribute": product_data["combination_id"],
                "id_address_delivery": address_id,
                "id_cart": cart_id,
                "quantity": 1,
                "quantity_refunded": 0,
                "quantity_returned": 0,
                "in_cart": 1,
            }
        )
        customization["customization"]["associations"]["customized_data_text_fields"][
            "customized_data_text_field"
        ] = custom_fields

        response = self.create_record("customizations", customization)

        return response["prestashop"]["customization"]["id"]

    def create_order(
        self, cart_id, customer_id, address_id, customization_id, product_data
    ):
        """
        Creates order on Prestashop
        """

        order = self.get_schema("orders")
        price = self.get_combination_data(
            product_data["product_id"], product_data["combination_id"]
        )["price"]

        order["order"].update(
            {
                "id_address_delivery": address_id,
                "id_address_invoice": address_id,
                "id_cart": cart_id,
                "id_currency": self.currency_id,
                "id_lang": self.lang_id,
                "id_customer": customer_id,
                "id_carrier": 1,
                "payment": "Payment by Check",
                "module": "ps_checkpayment",
                "total_paid": price,
                "total_paid_real": 0,
                "total_products": price,
                "total_products_wt": price,
                "conversion_rate": "1",
            }
        )
        response = self.create_record("orders", order)
        # Add customization id to the order
        order_details_id = response["prestashop"]["order"]["associations"][
            "order_rows"
        ]["order_row"]["id"]
        order_details = self.get_record_data("order_details", order_details_id)
        order_details["order_detail"]["id_customization"] = customization_id

        self.edit_record("order_details", order_details)

        return response["prestashop"]["order"]["id"]

    def place_order(self, order_data):
        """
        Steps to place order on Presta
        """
        customer_id = self.get_or_create_customer(order_data["customer"])
        address_id = self.get_or_create_default_address(
            order_data["customer"], customer_id
        )

        cart_id = self.create_cart(order_data, customer_id, address_id)
        customization_id = self.create_customization(order_data, cart_id, address_id)

        order_id = self.create_order(
            cart_id, customer_id, address_id, customization_id, order_data
        )

        return order_id

    def get_customer_details(self, customer_id):
        """
        Gets customer's details from Presta
        """

        customer = self.get_record_data("customers", customer_id)["customer"]
        customer_details = {
            "first_name": customer["firstname"],
            "last_name": customer["lastname"],
            "email": customer["email"],
        }

        return customer_details

    def get_customization_details(self, customization_id):
        """
        Gets the customization fields & values from Presta
        """

        customization_data = self.get_record_data("customizations", customization_id)[
            "customization"
        ]

        customization_details = {}
        for customization in customization_data["associations"][
            "customized_data_text_fields"
        ]["customized_data_text_field"]:
            customization_field_data = self.get_record_data(
                "product_customization_fields", customization["id_customization_field"]
            )

            customization_name = customization_field_data["customization_field"][
                "name"
            ]["language"][0]["value"]
            customization_details[
                customization_name.replace(" ", "_").lower()
            ] = customization["value"]

        return customization_details

    def get_order_details(self, order_data):
        """
        Gets all Order details from order_data
        """

        customer_details = self.get_customer_details(order_data["id_customer"])

        customization_id = order_data["associations"]["order_rows"]["order_row"][
            "id_customization"
        ]
        customization_details = self.get_customization_details(customization_id)

        # get product's details
        product_id = order_data["associations"]["order_rows"]["order_row"]["product_id"]
        product_data = self.get_record_data(
            "products", product_id, options={"display": "[name,id_category_default]"}
        )["product"]
        product_name = self.get_name_lang_dict(product_data["name"])

        combination_id = order_data["associations"]["order_rows"]["order_row"][
            "product_attribute_id"
        ]
        combination_name = self.get_combination_data(product_id, combination_id)["name"]

        order_details = {
            "order_id": order_data["id"],
            "reference_id": order_data["reference"],
            "payment_status": False,
            "customer": customer_details,
            "product": product_name,
            "combination": combination_name,
            "customization": customization_details,
        }

        return order_details
