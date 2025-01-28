from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import viewsets
from rest_framework.decorators import action

from django.contrib.auth.hashers import make_password
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
from django.shortcuts import get_object_or_404

from app.models import CustomUser, Material, Process, Failure, History
from app.serializers import MaterialSerializer, ProcessSerializer, FailureSerializer, HistorySerializer
from app.permissions import IsAdminRole, IsTechnicianRole, IsNurseRole

from django.http import HttpResponse
from reportlab.pdfgen import canvas
import openpyxl
import io

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
    
class HistoryViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    
    queryset = History.objects.all()
    serializer_class = HistorySerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class MaterialViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    
    queryset = Material.objects.all()
    serializer_class = MaterialSerializer

    @action(detail=True, methods=['get'])
    def rastreabilidade(self, request, pk=None):
        material = get_object_or_404(Material, pk=pk)
        process = Process.objects.filter(material=material).order_by('start_date')
        failure = Failure.objects.filter(material=material)

        return Response({
            "material": MaterialSerializer(material).data,
            "process": ProcessSerializer(process, many=True).data,
            "failures": FailureSerializer(failure, many=True).data,
        })

class ProcessViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    
    queryset = Process.objects.all()
    serializer_class = ProcessSerializer
    
    def perform_create(self, serializer):
        serializer.save(responsible=self.request.user)

class FailureViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    
    queryset = Failure.objects.all()
    serializer_class = FailureSerializer

class RelatorioViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]
    
    @action(detail=False, methods=['get'])
    def pdf(self, request):
        materiais = Material.objects.all()
        buffer = io.BytesIO()
        p = canvas.Canvas(buffer)
        p.drawString(100, 750, "Relatório de Materiais")

        y = 700
        for material in materiais:
            p.drawString(100, y, f"{material.serial} - {material.name} - {material.material_type}")
            y -= 20

        p.save()
        buffer.seek(0)
        return HttpResponse(buffer, content_type='application/pdf')

    @action(detail=False, methods=['get'])
    def xlsx(self, request):
        materiais = Material.objects.all()
        wb = openpyxl.Workbook()
        ws = wb.active
        ws.title = "Materiais"

        ws.append(["Serial", "Nome", "Tipo", "Validade"])
        for material in materiais:
            ws.append([material.serial, material.name, material.material_type, material.expiration_date])

        response = HttpResponse(content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
        response["Content-Disposition"] = 'attachment; filename="relatorio_materiais.xlsx"'
        wb.save(response)
        return response