from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response

class CustomPageNumberPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 10

    def get_paginated_response(self, data):
        return Response({
            'total_pages': self.page.paginator.num_pages,
            'count': self.page.paginator.count,
            'next': self.get_next_link(),
            'previous': self.get_previous_link(),
            'results': data
        })

    def get_paginated_response_schema(self, schema):
        return {
            'type': 'object',
            'properties': {
                'total_pages': {
                    'type': 'integer',
                    'example': 1
                },
                'count': {
                    'type': 'integer',
                    'example': 1
                },
                'next': {
                    'type': 'string',
                    'nullable': True,
                    'example': 'http://api.example.org/accounts/?page=4'
                },
                'previous': {
                    'type': 'string',
                    'nullable': True,
                    'example': 'http://api.example.org/accounts/?page=2'
                },
                'results': schema
            }
        }