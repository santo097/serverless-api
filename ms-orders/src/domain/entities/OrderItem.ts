export class OrderItem {
  private constructor(
    public readonly id: number,
    public readonly orderId: number,
    public readonly productId: number,
    public qty: number,
    public unitPriceCents: number,
    public subtotalCents: number
  ) {}

  static create(props: {
    id?: number;
    orderId: number;
    productId: number;
    qty: number;
    unitPriceCents: number;
    subtotalCents?: number;
  }): OrderItem {
    if (props.qty <= 0) {
      throw new Error("Quantity must be greater than 0");
    }

    return new OrderItem(
      props.id ?? 0,
      props.orderId,
      props.productId,
      props.qty,
      props.unitPriceCents,
      props.subtotalCents ?? props.unitPriceCents * props.qty
    );
  }

  static fromPrimitives(plain: {
    id: number;
    orderId: number;
    productId: number;
    qty: number;
    unitPriceCents: number;
    subtotalCents: number;
  }): OrderItem {
    return new OrderItem(
      plain.id,
      plain.orderId,
      plain.productId,
      plain.qty,
      plain.unitPriceCents,
      plain.subtotalCents
    );
  }

  toPrimitives() {
    return {
      id: this.id,
      orderId: this.orderId,
      productId: this.productId,
      qty: this.qty,
      unitPriceCents: this.unitPriceCents,
      subtotalCents: this.subtotalCents,
    };
  }
}
