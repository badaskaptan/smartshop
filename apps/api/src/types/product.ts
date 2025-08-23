export interface CreateProductRequest {
  name: string;
  description?: string;
  category?: string;
  brand?: string;
  model?: string;
  imageUrl?: string;
}

export interface UpdateProductRequest {
  name?: string;
  description?: string;
  category?: string;
  brand?: string;
  model?: string;
  imageUrl?: string;
}

export interface ProductResponse {
  success: boolean;
  product?: {
    id: string;
    name: string;
    description: string | null;
    category: string | null;
    brand: string | null;
    model: string | null;
    imageUrl: string | null;
    createdAt: Date;
    updatedAt: Date;
  };
  error?: string;
}

export interface ProductListResponse {
  success: boolean;
  products?: {
    id: string;
    name: string;
    description: string | null;
    category: string | null;
    brand: string | null;
    model: string | null;
    imageUrl: string | null;
    createdAt: Date;
    updatedAt: Date;
  }[];
  total?: number;
  page?: number;
  limit?: number;
  error?: string;
}

export interface ProductSearchQuery {
  q?: string;
  category?: string;
  brand?: string;
  page?: number;
  limit?: number;
}
