import { Repository } from "typeorm";
import { AppDataSource } from "../external/db/data-source";
import { ProductEntity } from "../external/db/entities/ProductEntity";

import { IProductRepository } from "../../domain/ports/repositories/IProductRepository";
import { Product } from "../../domain/entities/Product";

export class TypeormProductRepository implements IProductRepository {
  private ormRepo: Repository<ProductEntity>;

  constructor() {
    this.ormRepo = AppDataSource.getRepository(ProductEntity);
  }

  async create(product: Product): Promise<Product> {
    const primitives = product.toPrimitives();
    const entity = this.ormRepo.create({
      id: primitives.id,
      sku: primitives.sku,
      name: primitives.name,
      priceCents: primitives.priceCents,
      stock: primitives.stock,
      createdAt: primitives.createdAt,
    });
    const saved = await this.ormRepo.save(entity);
    return Product.fromPrimitives(saved);
  }

  async update(product: Product): Promise<Product> {
    const primitives = product.toPrimitives();
    await this.ormRepo.update(primitives.id, primitives);
    const updated = await this.ormRepo.findOneBy({ id: primitives.id });
    if (!updated) throw new Error(`Product with id ${primitives.id} not found`);
    return Product.fromPrimitives(updated);
  }

  async findById(id: number): Promise<Product | null> {
    const found = await this.ormRepo.findOneBy({ id });
    return found ? Product.fromPrimitives(found) : null;
  }

  async findBySku(sku: string): Promise<Product | null> {
    const found = await this.ormRepo.findOneBy({ sku });
    return found ? Product.fromPrimitives(found) : null;
  }

  async list(params?: { search?: string; cursor?: number; limit?: number }): Promise<Product[]> {
    const qb = this.ormRepo.createQueryBuilder("product");

    if (params?.search) {
      qb.where("product.name LIKE :search OR product.sku LIKE :search", {
        search: `%${params.search}%`,
      });
    }

    if (params?.cursor) {
      qb.andWhere("product.id > :cursor", { cursor: params.cursor });
    }

    qb.orderBy("product.id", "ASC");

    if (params?.limit) {
      qb.take(params.limit);
    }

    const products = await qb.getMany();
    return products.map((p) => Product.fromPrimitives(p));
  }

  async search(params: { search?: string; cursor?: number; limit?: number }): Promise<Product[]> {
    return this.list(params); // en este caso, list y search son equivalentes
  }

  async delete(id: number): Promise<void> {
    await this.ormRepo.delete(id);
  }
}
