export class Customer {
  private constructor(
    public readonly id: number,   // <- ahora es number
    public name: string,
    public email: string,
    public phone: string,
    public readonly createdAt: Date
  ) {}

  static create(props: {
    id?: number;   // <- opcional, lo genera la DB
    name: string;
    email: string;
    phone: string;
    createdAt?: Date;
  }): Customer {
    if (!props.email.includes("@")) {
      throw new Error("Invalid email format");
    }

    return new Customer(
      props.id ?? 0, // placeholder, DB asigna id real
      props.name,
      props.email,
      props.phone,
      props.createdAt ?? new Date()
    );
  }

  static fromPrimitives(plain: {
    id: number;
    name: string;
    email: string;
    phone: string;
    createdAt: Date;
  }): Customer {
    return new Customer(
      plain.id,
      plain.name,
      plain.email,
      plain.phone,
      plain.createdAt
    );
  }

  toPrimitives() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      phone: this.phone,
      createdAt: this.createdAt,
    };
  }
}
