from rest_framework import serializers
from app.models import CustomUser, Material, Process,Failure

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'role']
        
class MaterialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Material
        fields = '__all__'
        read_only_fields = ['created_at', 'serial']

class ProcessSerializer(serializers.ModelSerializer):
    class Meta:
        model = Process
        fields = '__all__'
        read_only_fields = ['start_date', 'responsible']

class FailureSerializer(serializers.ModelSerializer):
    class Meta:
        model = Failure
        fields = '__all__'
        read_only_fields = ['failure_date']
