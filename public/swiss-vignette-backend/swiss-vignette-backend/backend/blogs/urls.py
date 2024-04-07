from django.urls import path
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularRedocView,
    SpectacularSwaggerView,
)

from .views import (
    GetAllBlogsAPI
)

urlpatterns = [
    path("list_blogs/", GetAllBlogsAPI.as_view(), name="get-all-blogs"),
]
