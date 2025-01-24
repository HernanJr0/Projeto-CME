from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated

from django.contrib.auth.hashers import make_password
from django.core.validators import validate_email
from django.core.exceptions import ValidationError

from app.models import CustomUser
from app.permissions import IsAdminRole


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')
        role = request.data.get('role', 'tecnico')

        if role not in ['tecnico', 'enfermeiro', 'administrativo']:
            return Response({'error': 'Role inválido'}, status=status.HTTP_400_BAD_REQUEST)

        if not username or not email or not password:
            return Response(
                {'error': 'Todos os campos são obrigatórios'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            validate_email(email)
        except ValidationError:
            return Response({'error': 'Formato de email inválido'}, status=status.HTTP_400_BAD_REQUEST)

        if CustomUser.objects.filter(username=username).exists():
            return Response({'error': 'O nome de usuário escolhido já está sendo usado'}, status=status.HTTP_400_BAD_REQUEST)

        if CustomUser.objects.filter(email=email).exists():
            return Response({'error': 'O email escolhido já está sendo usado'}, status=status.HTTP_400_BAD_REQUEST)

        user = CustomUser.objects.create(
            username=username,
            email=email,
            password=make_password(password),
            role=role
        )

        user.save()

        return Response({'message': 'Usuário criado com sucesso'}, status=status.HTTP_201_CREATED)

class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "role": getattr(user, 'role', None),
        })
        
class UsersListView(APIView):
    permission_classes = [IsAuthenticated, IsAdminRole]

    def get(self, request):
        users = CustomUser.objects.all()
        user_data = [
            {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'date_joined': user.date_joined,
                'is_active': user.is_active,
                'role': getattr(user, 'role', None),
            }
            for user in users
        ]
        return Response(user_data, status=status.HTTP_200_OK)
    
class UserDetailView(APIView):
    permission_classes = [IsAuthenticated, IsAdminRole]
    
    def get(self, request, user_id):
        try:
            user = CustomUser.objects.get(id=user_id)
        except CustomUser.DoesNotExist:
            return Response({'error': 'Usuário não encontrado'}, status=status.HTTP_404_NOT_FOUND)
        
        user_data = {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'date_joined': user.date_joined,
            'is_active': user.is_active,
            'role': getattr(user, 'role', None),
        }
        
        return Response(user_data, status=status.HTTP_200_OK)
    
    def patch(self, request, user_id):
        try:
            user = CustomUser.objects.get(id=user_id)
        except CustomUser.DoesNotExist:
            return Response({'error': 'Usuário não encontrado'}, status=status.HTTP_404_NOT_FOUND)
        
        if 'role' in request.data:
            user.role = request.data['role']
        
        if 'username' in request.data:
            user.username = request.data['username']
        
        if 'email' in request.data:
            user.email = request.data['email']
        
        user.save()
        
        return Response({"message": "Usuário atualizado com sucesso"}, status=status.HTTP_200_OK)
    
    def delete(self, request, user_id):
        try:
            user = CustomUser.objects.get(id=user_id)
        except CustomUser.DoesNotExist:
            return Response({'error': 'Usuário não encontrado'}, status=status.HTTP_404_NOT_FOUND)
        
        user.delete()
        
        return Response({"message": "Usuário deletado com sucesso"}, status=status.HTTP_200_OK)