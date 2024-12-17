from django.urls import path
from . import views
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('categories/', views.category_list, name='category-list'),
    path('categories/<int:pk>/', views.category_detail, name='category-detail'),
    path('products/', views.product_list, name='product-list'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)