from rest_framework import permissions


class OwnerPerms(permissions.IsAuthenticated):
    def has_object_permission(self, request, view, obj):
        return super().has_object_permission(request, view, obj) and request.user == obj


class IsStaffPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.is_staff

# class CommentOwner(permissions.IsAuthenticated):
#     def has_object_permission(self, request, view, obj):
#         return super().has_object_permission(request, view, obj) and request.user == obj.user
