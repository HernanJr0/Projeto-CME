from rest_framework import serializers
from app.models import CustomUser, Material, Process, Failure, History

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
    material = serializers.PrimaryKeyRelatedField(queryset=Material.objects.all())  
    responsible = serializers.PrimaryKeyRelatedField(queryset=CustomUser.objects.all())  
    
    material_details = serializers.SerializerMethodField()
    responsible_details = serializers.SerializerMethodField()
    
    class Meta:
        model = Process
        fields = '__all__'
        read_only_fields = ['start_date', 'responsible', 'end_date']
    
    def get_material_details(self, obj):
        return {
            'id': obj.material.id,
            'name': obj.material.name,
            'serial': obj.material.serial
        }
    
    def get_responsible_details(self, obj):
        return {
            'id': obj.responsible.id,
            'username': obj.responsible.username
        }

class FailureSerializer(serializers.ModelSerializer):
    class Meta:
        model = Failure
        fields = '__all__'
        read_only_fields = ['failure_date']

class HistorySerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(queryset=CustomUser.objects.all())
    
    user_details = serializers.SerializerMethodField()
    
    class Meta:
        model = History
        fields = '__all__'
        read_only_fields = ['action']

    def get_user_details(self, obj):
        return {
            'id': obj.user.id,
            'username': obj.user.username
        }