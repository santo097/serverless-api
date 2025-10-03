import { OrderItem } from "./OrderItem";
import { OrderStatus } from "./OrderStatus";
export class Order {
  private constructor(
    public readonly id: number,
    public readonly customerId: number,
    public status: OrderStatus,
    public totalCents: number,
    public readonly createdAt: Date,
    public items: OrderItem[] = []
  ) {}

  static create(props: {
    id?: number;
    customerId: number;
    items: OrderItem[];
    status?: OrderStatus;
    createdAt?: Date;
  }): Order {
    const total = props.items.reduce((acc, item) => acc + item.subtotalCents, 0);

    return new Order(
      props.id ?? 0,
      props.customerId,
      props.status ?? OrderStatus.CREATED,
      total,
      props.createdAt ?? new Date(),
      props.items
    );
  }

  static fromPrimitives(plain: {
    id: number;
    customerId: number;
    status: OrderStatus;
    totalCents: number;
    createdAt: Date;
    items: ReturnType<OrderItem["toPrimitives"]>[];
  }): Order {
    return new Order(
      plain.id,
      plain.customerId,
      plain.status,
      plain.totalCents,
      plain.createdAt,
      plain.items.map((i) => OrderItem.fromPrimitives(i))
    );
  }

  toPrimitives() {
    return {
      id: this.id,
      customerId: this.customerId,
      status: this.status,
      totalCents: this.totalCents,
      createdAt: this.createdAt,
      items: this.items.map((i) => i.toPrimitives()),
    };
  }

  confirm() {
    if (this.status !== OrderStatus.CREATED) {
      throw new Error("Only CREATED orders can be confirmed");
    }
    this.status = OrderStatus.CONFIRMED;
  }

  cancel() {
    if (this.status === OrderStatus.CANCELED) {
      throw new Error("Order already canceled");
    }
    this.status = OrderStatus.CANCELED;
  }
}
