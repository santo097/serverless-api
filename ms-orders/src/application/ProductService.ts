import { IProductUseCases } from "../domain/ports/usecases/IProductUsecases";
import { IProductRepository } from "../domain/ports/repositories/IProductRepository";
import { Product } from "../domain/entities/Product";
import { ProductNotFoundError, ProductSkuAlreadyExistsError } from "../domain/errors/ProductErrors";

export class ProductService implements IProductUseCases {
  constructor(private readonly productRepo: IProductRepository) {}

  async createProduct(input: { sku: string; name: string; priceCents: number; stock: number }): Promise<Product> {
    const existing = await this.productRepo.findBySku(input.sku);
    if (existing) throw new ProductSkuAlreadyExistsError(input.sku);

    const product = Product.create(input);
    return this.productRepo.create(product);
  }

  async getProductById(id: number): Promise<Product> {
    const product = await this.productRepo.findById(id);
    if (!product) throw new ProductNotFoundError(id);
    return product;
  }

  async updateProduct(input: { id: number; priceCents?: number; stock?: number }): Promise<Product> {
    const existing = await this.productRepo.findById(input.id);
    if (!existing) throw new ProductNotFoundError(input.id);

    if (input.priceCents !== undefined) existing.priceCents = input.priceCents;
    if (input.stock !== undefined) existing.stock = input.stock;

    return this.productRepo.update(existing);
  }

  async listProducts(params?: { search?: string; cursor?: number; limit?: number }): Promise<Product[]> {
    return this.productRepo.list(params);
  }

  async searchProducts(params: { search?: string; cursor?: number; limit?: number }): Promise<Product[]> {
    return this.productRepo.search(params);
  }

  async deleteProduct(id: number): Promise<void> {
    const existing = await this.productRepo.findById(id);
    if (!existing) throw new ProductNotFoundError(id);
    await this.productRepo.delete(id);
  }
}
