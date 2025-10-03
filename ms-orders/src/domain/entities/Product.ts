export class Product {
  private constructor(
    public readonly id: number,
    public readonly sku: string,
    public name: string,
    public priceCents: number,
    public stock: number,
    public readonly createdAt: Date
  ) {}

  static create(props: {
    id?: number;
    sku: string;
    name: string;
    priceCents: number;
    stock: number;
    createdAt?: Date;
  }): Product {
    if (props.priceCents < 0) {
      throw new Error("Price must be non-negative");
    }

    return new Product(
      props.id ?? 0,
      props.sku,
      props.name,
      props.priceCents,
      props.stock,
      props.createdAt ?? new Date()
    );
  }

  static fromPrimitives(plain: {
    id: number;
    sku: string;
    name: string;
    priceCents: number;
    stock: number;
    createdAt: Date;
  }): Product {
    return new Product(
      plain.id,
      plain.sku,
      plain.name,
      plain.priceCents,
      plain.stock,
      plain.createdAt
    );
  }

  toPrimitives() {
    return {
      id: this.id,
      sku: this.sku,
      name: this.name,
      priceCents: this.priceCents,
      stock: this.stock,
      createdAt: this.createdAt,
    };
  }
}
