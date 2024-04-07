from django.urls import path
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularRedocView,
    SpectacularSwaggerView,
)

from .views import (
    CreateOrderAPI,
    GetImageAPI,
    PaymentStatusAPI,
    ProductByIdAPI,
    ProductListAPI,
    RefreshAPI,
    VehicleRegistrationCountryListAPI,
)

urlpatterns = [
    path("refresh", RefreshAPI.as_view(), name="refresh"),
    path(
        "vehicle-registration-countries",
        VehicleRegistrationCountryListAPI.as_view(),
        name="get-countries",
    ),
    path("image/<int:image_id>", GetImageAPI.as_view(), name="get-image"),
    path("products", ProductListAPI.as_view(), name="get-products"),
    path(
        "product/<int:product_id>",
        ProductByIdAPI.as_view(),
        name="get-product-by-id",
    ),
    path("create-order", CreateOrderAPI.as_view(), name="create-order"),
    path("payment-status", PaymentStatusAPI.as_view(), name="payment-status"),
    # OpenAPI Schema
    path("schema/", SpectacularAPIView.as_view(), name="schema"),
    # Optional UI:
    path(
        "schema/swagger-ui/",
        SpectacularSwaggerView.as_view(url_name="schema"),
        name="swagger-ui",
    ),
    path(
        "schema/redoc/", SpectacularRedocView.as_view(url_name="schema"), name="redoc"
    ),
]
