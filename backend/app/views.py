from rest_framework import viewsets
from app.models import TodoItem
from app.serializer import TodoItemSerializer

class TodoItemViewSet(viewsets.ModelViewSet):
    queryset = TodoItem.objects.all()
    serializer_class = TodoItemSerializer