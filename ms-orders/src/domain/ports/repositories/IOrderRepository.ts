import { Order } from "../../entities/Order";
import { OrderStatus } from "../../entities/OrderStatus";

export interface IOrderRepository {
  create(order: Order): Promise<Order>;
  updateStatus(id: number, status: OrderStatus): Promise<Order>;
  findById(id: number): Promise<Order | null>;
  search(params: {
    status?: OrderStatus;
    from?: Date;
    to?: Date;
    cursor?: number;
    limit?: number;
  }): Promise<Order[]>;
}
