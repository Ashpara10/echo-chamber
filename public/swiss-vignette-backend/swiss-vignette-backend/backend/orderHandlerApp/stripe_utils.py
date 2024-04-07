import json
import logging
import os

import stripe
from django.conf import settings
from stripe.error import InvalidRequestError

from .decorators import default_decorator

logger = logging.getLogger(__name__)

config = json.load(open(os.path.join(settings.STATIC_ROOT, "config.json")))
stripe.api_key = config["STRIPE_API_KEY"]


@default_decorator
def get_prices_from_stripe(vignette_types, need_eko=True) -> list:
    """
    Gets prices of each combination from Stripe
    gets both product price & eko fees in all the currencies
    """
    all_prices = stripe.Price.list(expand=["data.currency_options"])["data"]
    # logger.debug(f"All Prices from Stripe - {all_prices}")

    for vt in vignette_types:
        combination_id = vt["combination_id"]

        currency_prices = {}
        for price in all_prices:
            if price["active"] and price["lookup_key"] == f"product-{combination_id}":
                for currency, value in price["currency_options"].items():
                    currency_prices[currency] = round(
                        int(value["unit_amount_decimal"]) / 100, 2
                    )
                vt["price"] = currency_prices
                break

        eko_fees = {}
        for price in all_prices:
            if price["active"] and price["lookup_key"] == f"eko-{combination_id}":
                for currency, value in price["currency_options"].items():
                    eko_fees[currency] = round(
                        int(value["unit_amount_decimal"]) / 100, 2
                    )
                vt["eko_fees"] = eko_fees
                break

    return vignette_types


@default_decorator
def get_stripe_checkout_url(combination_id, currency, order_id):
    """
    Gets stripe's checkout url to based on product combination & currency
    """

    all_prices = stripe.Price.list(expand=["data.currency_options"])["data"]
    # logger.debug(f"Prices from Stripe - {all_prices}")

    prod_price_id = None
    eko_price_id = None
    for price in all_prices:
        if price["active"]:
            if price["lookup_key"] == f"product-{combination_id}":
                prod_price_id = price["id"]
            elif price["lookup_key"] == f"eko-{combination_id}":
                eko_price_id = price["id"]

    checkout_session = stripe.checkout.Session.create(
        line_items=[
            {"price": prod_price_id, "quantity": 1},
            {"price": eko_price_id, "quantity": 1},
        ],
        currency=currency,
        mode="payment",
        success_url=f"{config['DOMAIN']}/order/success?session_id={{CHECKOUT_SESSION_ID}}",
        client_reference_id=order_id,
    )

    return checkout_session.url


@default_decorator
def get_stripe_checkout_session(checkout_session_id):
    """
    Gets stripe's checkout session object from id
    """

    try:
        session = stripe.checkout.Session.retrieve(checkout_session_id)
        return session
    except InvalidRequestError:
        return None
