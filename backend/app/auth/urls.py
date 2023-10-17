from django.urls import path
from app.auth.views import MyObtainTokenPairView, RegisterView, LogoutView
from rest_framework_simplejwt import views as simple_jwt_views

urlpatterns = [
    path('login/', MyObtainTokenPairView.as_view(), name='token_obtain_pair'),
    path('login/refresh/', simple_jwt_views.TokenRefreshView.as_view(), name='token_refresh'),
    # path('register/', RegisterView.as_view(), name='auth_register'),
    path('logout/', LogoutView.as_view(), name ='logout')
]
