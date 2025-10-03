import { Product } from "../../entities/Product";

export interface IProductRepository {
  create(product: Product): Promise<Product>;
  update(product: Product): Promise<Product>;
  findById(id: number): Promise<Product | null>;
  findBySku(sku: string): Promise<Product | null>;
  search(params: { search?: string; cursor?: number; limit?: number }): Promise<Product[]>;
  list(params?: { search?: string; cursor?: number; limit?: number }): Promise<Product[]>;
  delete(id: number): Promise<void>; // faltante
}
