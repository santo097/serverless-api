import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { OrderEntity } from "./OrderEntity";
import { ProductEntity } from "./ProductEntity";

@Entity("order_items")
export class OrderItemEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: "order_id", type: "int" })
  orderId!: number;

  @Column({ name: "product_id", type: "int" })
  productId!: number;

  @Column({ type: "int" })
  qty!: number;

  @Column({ name: "unit_price_cents", type: "int" })
  unitPriceCents!: number;

  @Column({ name: "subtotal_cents", type: "int" })
  subtotalCents!: number;

  /** Relación con la orden */
  @ManyToOne(() => OrderEntity, (order) => order.items, { onDelete: "CASCADE" })
  @JoinColumn({ name: "order_id" })
  order!: OrderEntity;

  /** Relación con el producto */
  @ManyToOne(() => ProductEntity, { onDelete: "CASCADE" })
  @JoinColumn({ name: "product_id" })
  product!: ProductEntity;
}
