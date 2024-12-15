from django.contrib import admin
from .models import Category, Product

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
            return f'<img src="{obj.image.url}" style="max-height: 200px;" />'
        return 'No image'
    image_preview.short_description = 'Image Preview'
    image_preview.allow_tags = True

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