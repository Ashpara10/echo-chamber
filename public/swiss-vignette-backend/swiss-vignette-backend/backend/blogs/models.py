from ckeditor.fields import RichTextField
from django.db import models

# Create your models here.

class Blog(models.Model):
    '''
    Model to store blog data
    '''
    id = models.BigAutoField(primary_key=True)
    title = models.CharField(unique=False, null=False, max_length=256)
    permalink = models.CharField(unique=True, null=False, max_length=1024)
    content = RichTextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title
