from rest_framework.views import exception_handler


def custom_exception_handler(exc, context):
    # Call the default exception handler first
    response = exception_handler(exc, context)

    # Check if the exception is a 500 error
    if response is not None and response.status_code == 500:
        response.data = {"message": "Internal Server Error"}

    return response
