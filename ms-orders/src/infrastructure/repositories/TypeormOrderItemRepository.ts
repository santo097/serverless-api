import { Repository } from "typeorm";
import { AppDataSource } from "../external/db/data-source";
import { OrderItemEntity } from "../external/db/entities/OrderItemEntity";

import { IOrderItemRepository } from "../../domain/ports/repositories/IOrderItemRepository";
import { OrderItem } from "../../domain/entities/OrderItem";

export class TypeormOrderItemRepository implements IOrderItemRepository {
  private ormRepo: Repository<OrderItemEntity>;

  constructor() {
    this.ormRepo = AppDataSource.getRepository(OrderItemEntity);
  }

  async createMany(items: OrderItem[]): Promise<OrderItem[]> {
    const entities = items.map((i) =>
      this.ormRepo.create({
        id: i.id,
        orderId: i.orderId,
        productId: i.productId,
        qty: i.qty,
        unitPriceCents: i.unitPriceCents,
        subtotalCents: i.subtotalCents,
      })
    );

    const saved = await this.ormRepo.save(entities);

    return saved.map((s) =>
      OrderItem.fromPrimitives({
        id: s.id,
        orderId: s.orderId,
        productId: s.productId,
        qty: s.qty,
        unitPriceCents: s.unitPriceCents,
        subtotalCents: s.subtotalCents,
      })
    );
  }

  async findByOrderId(orderId: number): Promise<OrderItem[]> {
    const found = await this.ormRepo.find({
      where: { orderId },
    });

    return found.map((i) =>
      OrderItem.fromPrimitives({
        id: i.id,
        orderId: i.orderId,
        productId: i.productId,
        qty: i.qty,
        unitPriceCents: i.unitPriceCents,
        subtotalCents: i.subtotalCents,
      })
    );
  }
}
