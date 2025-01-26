from rest_framework.permissions import BasePermission

class IsAdminRole(BasePermission):
    def has_permission(self, request, view):
        user = request.user
        return user.role == 'administrativo'
    
class IsTechnicianRole(BasePermission):
    def has_permission(self, request, view):
        user = request.user
        return user.role == 'tecnico'
    
class IsNurseRole(BasePermission):
    def has_permission(self, request, view):
        user = request.user
        return user.role == 'enfermeiro'
