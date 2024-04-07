from django.db import models


class Customer(models.Model):
    first_name = models.CharField(max_length=200)
    last_name = models.CharField(max_length=200)
    email = models.EmailField()


class Product(models.Model):
    product_id = models.IntegerField()
    name = models.JSONField(max_length=1000)
    subtitle = models.JSONField(max_length=1000)
    description = models.JSONField(max_length=1000)
    image_id = models.IntegerField()


class Combination(models.Model):
    combination_id = models.IntegerField()
    name = models.JSONField(max_length=1000)
    price = models.JSONField(max_length=1000)
    eko_fees = models.JSONField(max_length=1000)
    image_id = models.IntegerField(null=True)


class CreateOrder(models.Model):
    currency = models.CharField(max_length=100)

    product_id = models.IntegerField()
    combination_id = models.IntegerField()

    vehicle_registration_country = models.CharField(max_length=1000)
    license_plate = models.CharField(max_length=1000)
    start_date = models.CharField(max_length=1000)


class OrderDetails(models.Model):
    order_id = models.IntegerField()
    reference_id = models.CharField(max_length=100)
    total_paid = models.CharField(max_length=100)

    payment_status = models.BooleanField()

    product = models.CharField(max_length=1000)
    combination = models.CharField(max_length=1000)
