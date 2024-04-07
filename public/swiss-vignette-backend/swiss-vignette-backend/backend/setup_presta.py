import json

from prestapyt import PrestaShopWebServiceDict

config = json.load(open("orderHandlerApp/static/config.json"))

prestashop_client = PrestaShopWebServiceDict(
    config["PRESTA_SHOP_API_URL"], config["PRESTA_SHOP_API_KEY"]
)

attribute_values = ["Annual"]
categories = ["Switzerland"]

# customization_fields = ["Vehicle Registration Country", "License Plate", "Start Date"]


def get_all_record_ids(resource) -> list:
    """
    Gets list of all record ids for a resource on Presta.
    """
    return prestashop_client.search(resource)


def get_all_records(resource, options=None) -> list:
    """
    Gets data of all records in a resource on Presta.
    """
    return prestashop_client.get(resource, options=options)


def get_record_data(resource, resource_id, options=None):
    """
    Gets a records's data in a resource from Presta.
    Resource could be - products, addresses
    """
    return prestashop_client.get(resource, resource_id=resource_id, options=options)


def delete_all_records(resource):
    """
    Deletes all records of a resource in Presta
    """

    record_ids = get_all_record_ids(resource)
    if resource == "categories":
        record_ids.remove(1)
        record_ids.remove(2)

    if resource == "products":
        return

    if record_ids:
        prestashop_client.delete(resource, resource_ids=record_ids)


def get_schema(resource):
    """
    Gets blank schema of a resource from Presta
    """
    return prestashop_client.get(resource, options={"schema": "blank"})


def create_record(resource, resource_data):
    return prestashop_client.add(resource, resource_data)


def delete_demo_data():
    resources = [
        "orders",
        "carts",
        "products",
        "categories",
        "product_feature_values",
        "product_features",
        "product_option_values",
        "product_options",
        "manufacturers",
        "suppliers",
        "customers",
        "addresses",
    ]
    for resource in resources:
        delete_all_records(resource)


def create_categs():
    all_categories = {}
    for categ in categories:
        categ_data = get_schema("categories")

        categ_data["category"]["id_parent"] = 2
        categ_data["category"]["active"] = 1
        categ_data["category"]["name"]["language"][0]["value"] = categ

        resp = create_record("categories", categ_data)
        all_categories[categ] = resp["prestashop"]["category"]["id"]

    return all_categories


def create_attrs():
    attr_data = get_schema("product_options")
    attr_data["product_option"]["name"]["language"][0]["value"] = "Vignette Type"
    attr_data["product_option"]["public_name"]["language"][0]["value"] = "Vignette Type"
    attr_data["product_option"]["group_type"] = "radio"

    attr_id = create_record("product_options", attr_data)["prestashop"][
        "product_option"
    ]["id"]

    all_attributes = {}
    for attr_value in attribute_values:
        attr_value_data = get_schema("product_option_values")

        attr_value_data["product_option_value"]["id_attribute_group"] = attr_id
        attr_value_data["product_option_value"]["name"]["language"][0][
            "value"
        ] = attr_value

        resp = create_record("product_option_values", attr_value_data)
        all_attributes[attr_value] = resp["prestashop"]["product_option_value"]["id"]

    return all_attributes


def create_vehicle_registration_countries():
    default_countries = json.load(open("orderHandlerApp/static/default_countries.json"))

    feature_data = get_schema("product_features")
    feature_data["product_feature"]["name"]["language"][0][
        "value"
    ] = "Vehicle Registration Country"
    resp = create_record("product_features", feature_data)
    feature_id = resp["prestashop"]["product_feature"]["id"]

    for country in default_countries:
        feature_value_data = get_schema("product_feature_values")
        feature_value_data["product_feature_value"]["id_feature"] = feature_id
        feature_value_data["product_feature_value"]["value"]["language"][0][
            "value"
        ] = country
        create_record("product_feature_values", feature_value_data)


def create_required_data():
    create_categs()
    create_attrs()
    create_vehicle_registration_countries()


def main():
    delete_demo_data()
    create_required_data()


if __name__ == "__main__":
    main()
