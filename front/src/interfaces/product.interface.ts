export interface Category {
    id: number;
    name: string;
    description?: string | null;
    is_active: boolean;
    product_count: number;
  }
  
  export interface Product {
    id: number;
    name: string;
    description: string | null;
    price: number;
    category: number;
    category_name: string;
    is_available: boolean;
    image: string | null;
    stock: number;
    created_at: string;
  }

  export interface PaginatedProducts {
    count: number;
    next: string | null;
    previous: string | null;
    results: Product[];
  }