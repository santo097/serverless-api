import { OrderItem } from "../../entities/OrderItem";

export interface IOrderItemRepository {
  createMany(items: OrderItem[]): Promise<OrderItem[]>;
  findByOrderId(orderId: number): Promise<OrderItem[]>;
}
