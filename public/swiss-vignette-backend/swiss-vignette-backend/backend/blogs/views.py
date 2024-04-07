from django.shortcuts import render
from rest_framework.generics import ListAPIView

from .models import Blog
from .pagination import CustomPageNumberPagination
from .serializers import BlogSerializer

class GetAllBlogsAPI(ListAPIView):
    """
    List all blogs
    """

    queryset = Blog.objects.all().order_by('-created_at')
    pagination_class = CustomPageNumberPagination
    serializer_class = BlogSerializer

