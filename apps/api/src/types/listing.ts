export interface CreateListingRequest {
  productId: string;
  platform: string;
  platformProductId?: string;
  price: number;
  currency?: string;
  url?: string;
  inStock?: boolean;
  title?: string;
  description?: string;
}

export interface UpdateListingRequest {
  platform?: string;
  platformProductId?: string;
  price?: number;
  currency?: string;
  url?: string;
  inStock?: boolean;
  title?: string;
  description?: string;
}

export interface ListingResponse {
  success: boolean;
  listing?: {
    id: string;
    productId: string;
    platform: string;
    platformProductId: string | null;
    price: number;
    currency: string;
    url: string | null;
    inStock: boolean;
    title: string | null;
    description: string | null;
    createdAt: Date;
    updatedAt: Date;
    product?: {
      id: string;
      name: string;
      category: string | null;
      brand: string | null;
    };
  };
  error?: string;
}

export interface ListingListResponse {
  success: boolean;
  listings?: {
    id: string;
    productId: string;
    platform: string;
    platformProductId: string | null;
    price: number;
    currency: string;
    url: string | null;
    inStock: boolean;
    title: string | null;
    description: string | null;
    createdAt: Date;
    updatedAt: Date;
    product?: {
      id: string;
      name: string;
      category: string | null;
      brand: string | null;
    };
  }[];
  total?: number;
  page?: number;
  limit?: number;
  error?: string;
}

export interface ListingSearchQuery {
  productId?: string;
  platform?: string;
  inStock?: boolean;
  minPrice?: number;
  maxPrice?: number;
  currency?: string;
  page?: number;
  limit?: number;
}

export interface PriceComparisonResponse {
  success: boolean;
  productId?: string;
  productName?: string;
  lowestPrice?: {
    platform: string;
    price: number;
    currency: string;
    url?: string;
    inStock: boolean;
  };
  highestPrice?: {
    platform: string;
    price: number;
    currency: string;
    url?: string;
    inStock: boolean;
  };
  averagePrice?: number;
  platformCount?: number;
  listings?: {
    platform: string;
    price: number;
    currency: string;
    url?: string;
    inStock: boolean;
    updatedAt: Date;
  }[];
  error?: string;
}
