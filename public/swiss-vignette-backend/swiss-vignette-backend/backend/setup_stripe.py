import json

import requests
import stripe

SERVER = "http://localhost:8000"

config = json.load(open("orderHandlerApp/static/config.json"))
stripe.api_key = config["STRIPE_API_KEY"]

prods_resp = requests.get(f"{SERVER}/api/products")
product_ids = [prod["product_id"] for prod in json.loads(prods_resp.content)]

for product_id in product_ids:
    prod_resp = requests.get(f"{SERVER}/api/product/{product_id}")
    product_data = json.loads(prod_resp.content)

    for combination in product_data["combinations"]:
        # Product
        name = f"{product_data['name']['en']} - {combination['name']['en']}"
        chf_price = int(float(combination["price"]) * 100)
        # eur_price = int(float(combination["price"]) * 0.041 * 1.035 * 100)
        print(name, chf_price)

        product_obj = stripe.Product.create(name=name)
        price_obj = stripe.Price.create(
            product=product_obj["id"],
            unit_amount_decimal=chf_price,
            currency="chf",
            # currency_options={"eur": {"unit_amount_decimal": eur_price}},
            lookup_key=f"product-{combination['combination_id']}",
        )

        # EKO
        eko_name = f"EKO - {product_data['name']['en']} - {combination['name']['en']}"
        eko_chf_price = 1000
        # eko_eur_price = 200
        print(eko_name, eko_chf_price)

        eko_product_obj = stripe.Product.create(name=eko_name)
        eko_price_obj = stripe.Price.create(
            product=eko_product_obj["id"],
            unit_amount_decimal=eko_chf_price,
            currency="chf",
            # currency_options={"eur": {"unit_amount_decimal": eko_eur_price}},
            lookup_key=f"eko-{combination['combination_id']}",
        )
