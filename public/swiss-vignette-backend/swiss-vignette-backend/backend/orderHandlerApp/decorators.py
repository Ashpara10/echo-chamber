import functools
import inspect
import logging

logger = logging.getLogger(__name__)


def default_decorator(func):
    """
    default try/except decorator with entry & error logs
    """

    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        args_list = [repr(arg) for arg in args]
        args_list.extend([f"{key}={val!r}" for key, val in kwargs.items()])

        logger.debug(
            f"Calling {func.__name__} with arguments: {', '.join(args_list[1:])}"
        )

        try:
            result = func(*args, **kwargs)
            logger.debug(f"{func.__name__} returning: {result}")
            return result
        except Exception:
            logger.exception(f"Error in {func.__name__}")

            return_type = inspect.signature(func).return_annotation
            if return_type is list:
                return []
            elif return_type is dict:
                return {}
            else:
                return None

    return wrapper


class ErrorHandler(type):
    """Metaclass to apply default_decorator to all methods of a class"""

    def __new__(cls, name, bases, dct):
        for attr_name, attr_value in dct.items():
            if callable(attr_value):
                dct[attr_name] = default_decorator(attr_value)

        return super(ErrorHandler, cls).__new__(cls, name, bases, dct)
