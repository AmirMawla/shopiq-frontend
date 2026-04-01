export interface Product {
    _id?: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    categoryId: string | { _id: string; name: string; slug: string };
    images?: { fileId: string; url: string }[];
    imageUrl?: string;
    vendorId?: string;
    slug?: string;
    averageRating?: number;
    reviewCount?: number;
    isActive?: boolean;
    tags?: string[];
    inStock?: boolean;
}

export interface Review {
    _id?: string;
    userId: any;
    productId: string;
    rating: number;
    comment: string;
    images?: string[];
    isApproved?: boolean;
    isReported?: boolean;
    createdAt?: string;
}