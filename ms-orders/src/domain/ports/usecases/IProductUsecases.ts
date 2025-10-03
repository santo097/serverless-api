import { Product } from "../../entities/Product";

export interface IProductUseCases {
  createProduct(input: { sku: string; name: string; priceCents: number; stock: number }): Promise<Product>;
  getProductById(id: number): Promise<Product>;
  updateProduct(input: { id: number; priceCents?: number; stock?: number }): Promise<Product>;
  listProducts(params?: { search?: string; cursor?: number; limit?: number }): Promise<Product[]>;
  searchProducts(params: { search?: string; cursor?: number; limit?: number }): Promise<Product[]>; // opcional si queremos distinguir
  deleteProduct(id: number): Promise<void>; 
}
