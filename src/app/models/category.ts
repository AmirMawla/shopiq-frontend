export interface Category {
    _id?: string;
    name: string;
    description?: string;
    categoryImageUrl?: {
        url: string;
        fileId: string;
    };
    slug?: string;
    isActive?: boolean;
}
