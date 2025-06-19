export interface Product {
    id: number;
    title: string;
    slug: string;
    price: number;
    description: string;
    category: Category;
    images: string[];
}

export interface Category {
    id: number;
    name: string;
    image: string;
    slug: string;
}

export interface CartItem {
    product: Product;
    quantity: number;
}

export interface CreateProduct {
    title: string;
    price: number;
    description: string;
    categoryId: number;
    images: string[];
}