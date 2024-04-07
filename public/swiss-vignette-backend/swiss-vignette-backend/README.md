# swiss-vignette

## FRONTEND

Figma: https://www.figma.com/file/WMosoxqZIirSNeVnfp8AJw/Swiss-Vignette


## BACKEND

### Installation

```bash
    sudo apt-get install pkg-config build-essential libmysqlclient-dev
    pip3 install mysql-connector
    pip install -r requirements.txt
```

### DRF API Specifications

To generate API specification via drf-spectacular, run:

    python3 ./manage.py spectacular --color --file schema.yml --validate

### Admin

http://139.59.90.109/prestashop/admin849y6bnsjaphqohvpgw/

admin@vignettes.ch


## Presta Specifications

- Category is the country name - Switzerland.
- Each Product should be the name of a vehicle type and should belong to the Switzerland category.
- The name, summary and image of the product can be changed on Prestashop to update on the website. The image should have square dimensions.
- Each product must have 3 customization fields - "Vehicle Registration Country", "License Plate", "Start Date"
- Each product will have combinations based on the "Vignette Type" attribute in Prestashop.
- Vehicle Registration Countries list is available inside "Vehicle Registration Country" feature on Prestashop.

- By default, a new order uses the first shipping options available.
- By default, a new order would display payment method as "Payment by check".

## Stripe Specifications

For each product combination on Prestashop, there are 2 corresponding products on Stripe:

- "__productName__ - __vignetteDuration__": has price in all supported currencies with lookup key as "product-__combinationId__"
- "EKO - __productName__ - __vignetteDuration__": has price in all supported currencies with lookup key as "eko-__combinationId__"


## Creating a new product

- Create the product(with combinations) on Prestashop with name, summary, cover image (square).
- Add a default category of the product - Switzerland.
- Add 3 customization fields - "Vehicle Registration Country", "License Plate", "Start Date"
- Add combinations for different vignette durations.

- For each combination, create a product on Stripe in the format - "__productName__ - __vignetteDuration__"
- Add price to the product.
- Add lookup key - "product-__combinationId__" in the price. You can get combinationId from Prestashop.

- For each combination, create a product for EKO fee on Stripe in the format - "EKO - __productName__ - __vignetteDuration__"
- Add price to this EKO product.
- Add lookup key - "eko-__combinationId__" in the price. You can get combinationId from Prestashop.



## Presta Setup

When installing Presta, set the country as UK. Once installed, update the default currency in Presta to CHF.


To begin, get the WebService API Key from Prestashop:

- Go to Advanced Parameters - Webservice
- Enable PrestaShop's webservice
- Add new webservice key. Generate the key and add it to `config.json`
- Enable "All" permissions for all the resources.

Next run the script `setup_presta.py`. It would delete all the unnecessary demo data and add the required data.

## Stripe Setup

We need to setup products & prices on Stripe as well.
Run the django server & then run `setup_stripe.py` to automatically create products on stripe based on Prestashop's data.





