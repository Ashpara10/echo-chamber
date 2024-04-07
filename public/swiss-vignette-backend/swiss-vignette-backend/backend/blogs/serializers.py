from drf_spectacular.utils import extend_schema_field
from rest_framework import serializers

from .models import Blog

class BlogSerializer(serializers.ModelSerializer):

    html_content = serializers.SerializerMethodField()

    @extend_schema_field(serializers.CharField)
    def get_html_content(self, instance):
        html_content = instance.content.replace('\n', '').replace('\r', '')
        return html_content

    class Meta:
        model = Blog
        fields = ['id', 'title', 'permalink', 'html_content', 'created_at', 'updated_at']
