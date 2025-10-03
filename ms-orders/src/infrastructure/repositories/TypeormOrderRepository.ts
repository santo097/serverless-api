import { Repository } from "typeorm";
import { AppDataSource } from "../external/db/data-source";
import { OrderEntity } from "../external/db/entities/OrderEntity";
import { OrderItemEntity } from "../external/db/entities/OrderItemEntity";

import { IOrderRepository } from "../../domain/ports/repositories/IOrderRepository";
import { Order } from "../../domain/entities/Order";
import { OrderItem } from "../../domain/entities/OrderItem";
import { OrderStatus } from "../../domain/entities/OrderStatus";

export class TypeormOrderRepository implements IOrderRepository {
  private ormRepo: Repository<OrderEntity>;

  constructor() {
    this.ormRepo = AppDataSource.getRepository(OrderEntity);
  }

  async create(order: Order): Promise<Order> {
    const primitives = order.toPrimitives();

    const entity = this.ormRepo.create({
      customerId: primitives.customerId,
      status: primitives.status,
      totalCents: primitives.totalCents,
      createdAt: primitives.createdAt,
      items: primitives.items.map((i) =>
        Object.assign(new OrderItemEntity(), {
          productId: i.productId,
          qty: i.qty,
          unitPriceCents: i.unitPriceCents,
          subtotalCents: i.subtotalCents,
        })
      ),
    });

    const saved = await this.ormRepo.save(entity);

    return Order.fromPrimitives({
      id: saved.id,
      customerId: saved.customerId,
      status: saved.status,
      totalCents: saved.totalCents,
      createdAt: saved.createdAt,
      items: saved.items.map((i) =>
        OrderItem.fromPrimitives({
          id: i.id,
          orderId: saved.id,
          productId: i.productId,
          qty: i.qty,
          unitPriceCents: i.unitPriceCents,
          subtotalCents: i.subtotalCents,
        })
      ),
    });
  }

  async updateStatus(id: number, status: OrderStatus): Promise<Order> {
    await this.ormRepo.update(id, { status });

    const updated = await this.ormRepo.findOne({
      where: { id },
      relations: ["items"],
    });

    if (!updated) throw new Error(`Order with id ${id} not found`);

    return Order.fromPrimitives({
      id: updated.id,
      customerId: updated.customerId,
      status: updated.status,
      totalCents: updated.totalCents,
      createdAt: updated.createdAt,
      items: updated.items.map((i) =>
        OrderItem.fromPrimitives({
          id: i.id,
          orderId: updated.id,
          productId: i.productId,
          qty: i.qty,
          unitPriceCents: i.unitPriceCents,
          subtotalCents: i.subtotalCents,
        })
      ),
    });
  }

  async findById(id: number): Promise<Order | null> {
    const found = await this.ormRepo.findOne({
      where: { id },
      relations: ["items"],
    });
    if (!found) return null;

    return Order.fromPrimitives({
      id: found.id,
      customerId: found.customerId,
      status: found.status,
      totalCents: found.totalCents,
      createdAt: found.createdAt,
      items: found.items.map((i) =>
        OrderItem.fromPrimitives({
          id: i.id,
          orderId: found.id,
          productId: i.productId,
          qty: i.qty,
          unitPriceCents: i.unitPriceCents,
          subtotalCents: i.subtotalCents,
        })
      ),
    });
  }

  async search(params: {
    status?: OrderStatus;
    from?: Date;
    to?: Date;
    cursor?: number;
    limit?: number;
  }): Promise<Order[]> {
    const qb = this.ormRepo.createQueryBuilder("order")
      .leftJoinAndSelect("order.items", "items");

    if (params.status) {
      qb.andWhere("order.status = :status", { status: params.status });
    }

    if (params.from) {
      qb.andWhere("order.created_at >= :from", { from: params.from });
    }

    if (params.to) {
      qb.andWhere("order.created_at <= :to", { to: params.to });
    }

    if (params.cursor) {
      qb.andWhere("order.id > :cursor", { cursor: params.cursor });
    }

    qb.orderBy("order.id", "ASC");

    if (params.limit) {
      qb.take(params.limit);
    }

    const orders = await qb.getMany();

    return orders.map((o) =>
      Order.fromPrimitives({
        id: o.id,
        customerId: o.customerId,
        status: o.status,
        totalCents: o.totalCents,
        createdAt: o.createdAt,
        items: o.items.map((i) =>
          OrderItem.fromPrimitives({
            id: i.id,
            orderId: o.id,
            productId: i.productId,
            qty: i.qty,
            unitPriceCents: i.unitPriceCents,
            subtotalCents: i.subtotalCents,
          })
        ),
      })
    );
  }
}
