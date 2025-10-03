import { Order } from "../../entities/Order";

export interface IOrderUseCases {
  createOrder(input: { customerId: number; items: { productId: number; qty: number }[] }): Promise<Order>;
  getOrderById(id: number): Promise<Order | null>;
  listOrders(params?: { status?: string; from?: Date; to?: Date; cursor?: number; limit?: number }): Promise<Order[]>;
  confirmOrder(id: number, idempotencyKey: string): Promise<Order>;
  cancelOrder(id: number): Promise<Order>;
}
