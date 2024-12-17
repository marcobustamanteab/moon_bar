import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Category } from "../../interfaces/product.interface";
// import { ProductAPI } from '../../api/endpoints/products';

interface CategoryGridViewProps {
  categories: Category[];
  onImageError?: (category: Category) => void;
}

const CategoryGridView: React.FC<CategoryGridViewProps> = ({
  categories,
  onImageError,
}) => {
  const navigate = useNavigate();

  useEffect(() => {
    console.log("CategoryGridView rendering with categories:", categories);
    categories.forEach((category) => {
      console.log(`Category ${category.name} image URL:`, category.image);
    });
  }, [categories]);

  const handleImageError = (category: Category) => {
    console.log("Error loading image for category:", category.name);
    if (onImageError) {
      onImageError(category);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
      {categories.map((category) => (
        <div
          key={category.id}
          className="relative group cursor-pointer rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl"
          onClick={() => navigate(`/products/category/${category.id}`)}
        >
          <div className="aspect-square bg-gray-200 w-full">
            <img
              src={category.image || "/api/placeholder/400/400"}
              alt={category.name}
              className="w-full h-full object-cover"
              onError={() => handleImageError(category)}
            />
          </div>

          <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-end p-4 transition-opacity duration-300 group-hover:bg-opacity-60">
            <h3 className="text-white text-xl font-bold mb-1">
              {category.name}
            </h3>
            <p className="text-white text-sm mb-2">
              {category.description || "No description"}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-white text-sm">
                {category.product_count} products
              </span>
              <span className="bg-white text-black px-3 py-1 rounded-full text-sm">
                View
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CategoryGridView;
