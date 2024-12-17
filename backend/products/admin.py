from django.contrib import admin
from django.utils.html import format_html
from .models import Category, Product

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'is_active', 'product_count', 'image_preview_small', 'created_at')
    list_filter = ('is_active', 'created_at')
    search_fields = ('name', 'description')
    list_editable = ('is_active',)
    
    # Campos de solo lectura
    readonly_fields = ('created_at', 'updated_at', 'image_preview')
    
    def image_preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="max-height: 200px;" />', obj.image.url)
        return 'No image'
    image_preview.short_description = 'Image Preview'
    
    def image_preview_small(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="height: 50px;" />', obj.image.url)
        return 'No image'
    image_preview_small.short_description = 'Image'

    def product_count(self, obj):
        return obj.products.count()
    product_count.short_description = 'Products'

    # Configuración de campos en el formulario de edición
    fieldsets = (
        (None, {
            'fields': ('name', 'description', 'is_active')
        }),
        ('Image', {
            'fields': ('image', 'image_preview')
        }),
        ('Metadata', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        })
    )

    # Excluir los campos de timestamp de la edición
    exclude = ('created_at', 'updated_at')

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'price', 'is_available', 'stock', 'created_at', 'updated_at')
    list_filter = ('category', 'is_available', 'created_at')
    search_fields = ('name', 'description')
    list_editable = ('is_available', 'stock')
    
    # Campos de solo lectura
    readonly_fields = ('created_at', 'updated_at', 'image_preview')
    
    def image_preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="max-height: 200px;" />', obj.image.url)
        return 'No image'
    image_preview.short_description = 'Image Preview'

    # Configuración de campos en el formulario de edición
    fieldsets = (
        (None, {
            'fields': ('name', 'description', 'category', 'price')
        }),
        ('Inventory', {
            'fields': ('is_available', 'stock', 'image', 'image_preview')
        }),
        ('Metadata', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        })
    )

    # Excluir los campos de timestamp de la edición
    exclude = ('created_at', 'updated_at')