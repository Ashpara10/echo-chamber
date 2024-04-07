from django.contrib import admin
from .models import Blog

class BlogAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'permalink', 'created_at', 'updated_at')

# Register your models here.
admin.site.register(Blog, BlogAdmin)