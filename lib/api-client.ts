import { IOrder } from "@/models/order.model";
import { ImageVariant, IProduct } from "@/models/product.model";
import { Types } from "mongoose";




export type ProductFormData = Omit<IProduct, "_id">;


export interface CreateOrder {
    productId: Types.ObjectId | string;
    variant: ImageVariant;
}

type FetchOptions = {
    method?: "GET" | "POST" | "DELETE" | "PUT";
    body?: any;
    headers?: Record<string, string>;
}


class ApiClient {
    private async fetch<T>(
        endpoint: string,
        options: FetchOptions = {}
    ): Promise<T> {
        const { method = "GET", body, headers = {} } = options;

        const defaultHeaders = {
            "Content-Type": "application/json",
            ...headers,
        };

        const response = await fetch(endpoint, {
            method,
            body: JSON.stringify(body),
            headers: defaultHeaders,
        });

        if (!response.ok) {
            throw new Error(response.statusText);
        }

        return response.json() as Promise<T>;
    }

    async getProducts(): Promise<IProduct[]> {
        return this.fetch<IProduct[]>("/products");
    }
    async getProduct(id: string): Promise<IProduct> {
        return this.fetch<IProduct>(`/products/${id}`);
    }

    async createProduct(productData: ProductFormData): Promise<IProduct> {
        return this.fetch<IProduct>("/products", {
            method: "POST",
            body: productData,
        });
    }
    async getUserOrders() {
        return this.fetch<IOrder[]>("/orders/user");
    }
    async createOrder(orderData: CreateOrder) {
        const sanitizedOrderData = {
            ...orderData,
            productId: orderData.productId.toString(),
        };

        return this.fetch<{ orderId: string; amount: number }>("/orders", {
            method: "POST",
            body: sanitizedOrderData,
        });
    }
}

export const apiClient = new ApiClient();