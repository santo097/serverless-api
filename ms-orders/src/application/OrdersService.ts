import { IOrderUseCases } from "../domain/ports/usecases/IOrderUsecases";
import { IOrderRepository } from "../domain/ports/repositories/IOrderRepository";
import { IProductRepository } from "../domain/ports/repositories/IProductRepository";
import { IIdempotencyKeyUseCases } from "../domain/ports/usecases/IIdempotencyKeyUsecases";
import { ICustomerValidator } from "../domain/ports/usecases/ICustomerValidator";

import { Order } from "../domain/entities/Order";
import { OrderItem } from "../domain/entities/OrderItem";
import { OrderStatus } from "../domain/entities/OrderStatus";

import { ProductNotFoundError } from "../domain/errors/ProductErrors";
import { OrderNotFoundError } from "../domain/errors/OrderErrors";
import { CustomerNotFoundError } from "../domain/errors/CustomerNotFoundError";

export class OrderService implements IOrderUseCases {
  constructor(
    private readonly orderRepo: IOrderRepository,
    private readonly productRepo: IProductRepository,
    private readonly idempotencyService: IIdempotencyKeyUseCases,
    private readonly customerValidator: ICustomerValidator
  ) {}

  async createOrder(input: {
    customerId: number;
    items: { productId: number; qty?: number; quantity?: number }[];
  }, token: string): Promise<Order> {

    // Validar cliente con token recibido
    const exists = await this.customerValidator.validateCustomerExists(input.customerId, token);
    if (!exists) {
      throw new CustomerNotFoundError(input.customerId);
    }

    const orderItems: OrderItem[] = [];
    for (const item of input.items) {
      const qty = Number(item.qty ?? item.quantity);
      if (!Number.isInteger(qty) || qty <= 0) {
        throw new Error(`Invalid quantity for product ${item.productId}`);
      }

      const product = await this.productRepo.findById(item.productId);
      if (!product) throw new ProductNotFoundError(item.productId);

      const priceCents = Number(product.priceCents);
      if (!Number.isInteger(priceCents) || priceCents <= 0) {
        throw new Error(`Invalid price for product ${product.id}`);
      }

      if (product.stock < qty) {
        throw new Error(`Not enough stock for product ${product.id}`);
      }

      product.stock -= qty;
      await this.productRepo.update(product);

      const orderItem = OrderItem.create({
        orderId: 0,
        productId: product.id,
        qty,
        unitPriceCents: priceCents,
        subtotalCents: qty * priceCents,
      });

      orderItems.push(orderItem);
    }

    const order = Order.create({
      customerId: input.customerId,
      items: orderItems,
      status: OrderStatus.CREATED,
    });

    return this.orderRepo.create(order);
  }
  
  async getOrderById(id: number): Promise<Order> {
    const order = await this.orderRepo.findById(id);
    if (!order) throw new OrderNotFoundError(id);
    return order;
  }

  async listOrders(params?: {
    status?: OrderStatus;
    from?: Date;
    to?: Date;
    cursor?: number;
    limit?: number;
  }): Promise<Order[]> {
    return this.orderRepo.search(params ?? {}); 
  }

  async confirmOrder(id: number, idempotencyKey: string): Promise<Order> {
    const existing = await this.orderRepo.findById(id);
    if (!existing) throw new OrderNotFoundError(id);

    if (existing.status === OrderStatus.CANCELED) {
      throw new Error("Cannot confirm a canceled order");
    }


    const idemKey = await this.idempotencyService.getKey(idempotencyKey);
    if (idemKey) {

      return Order.fromPrimitives(JSON.parse(idemKey.responseBody));
    }


    existing.confirm();
    const confirmed = await this.orderRepo.updateStatus(existing.id, existing.status);


    await this.idempotencyService.createKey({
      key: idempotencyKey,
      targetType: "order",
      targetId: confirmed.id.toString(),
      status: confirmed.status,
      responseBody: JSON.stringify(confirmed.toPrimitives()),
      expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hora
    });

    return confirmed;
  }

async cancelOrder(id: number, idempotencyKey?: string): Promise<Order> {
  if (idempotencyKey) {
    const idemKey = await this.idempotencyService.getKey(idempotencyKey);
    if (idemKey) {

      return Order.fromPrimitives(JSON.parse(idemKey.responseBody));
    }
  }

  const existing = await this.orderRepo.findById(id);
  if (!existing) throw new OrderNotFoundError(id);


  if (existing.status === OrderStatus.CANCELED) {

    if (idempotencyKey) {
      await this.idempotencyService.createKey({
        key: idempotencyKey,
        targetType: "order",
        targetId: existing.id.toString(),
        status: existing.status,
        responseBody: JSON.stringify(existing.toPrimitives()),
        expiresAt: new Date(Date.now() + 60 * 60 * 1000),
      });
    }
    return existing;
  }


  if (existing.status === OrderStatus.CONFIRMED) {
    const now = new Date();
    const diffMinutes = (now.getTime() - existing.createdAt.getTime()) / (1000 * 60);
    if (diffMinutes > 10) {
      throw new Error("Confirmed orders can only be canceled within 10 minutes");
    }
  }


  existing.cancel();
  const canceled = await this.orderRepo.updateStatus(existing.id, existing.status);

  for (const item of existing.items) {
    const product = await this.productRepo.findById(item.productId);
    if (product) {
      product.stock += item.qty;
      await this.productRepo.update(product);
    }
  }


  if (idempotencyKey) {
    await this.idempotencyService.createKey({
      key: idempotencyKey,
      targetType: "order",
      targetId: canceled.id.toString(),
      status: canceled.status,
      responseBody: JSON.stringify(canceled.toPrimitives()),
      expiresAt: new Date(Date.now() + 60 * 60 * 1000),
    });
  }

  return canceled;
}


}
