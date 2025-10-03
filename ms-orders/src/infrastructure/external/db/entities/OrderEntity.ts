import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from "typeorm";
import { OrderStatus } from "../../../../domain/entities/OrderStatus";
import { OrderItemEntity } from "./OrderItemEntity";

@Entity("orders")
export class OrderEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: "customer_id", type: "int" })
  customerId!: number;

  @Column({
    type: "enum",
    enum: OrderStatus,
    default: OrderStatus.CREATED,
  })
  status!: OrderStatus;

  @Column({ name: "total_cents", type: "int" })
  totalCents!: number;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  /** Relación: un pedido tiene muchos items */
  @OneToMany(() => OrderItemEntity, (item) => item.order, { cascade: true })
  items!: OrderItemEntity[];
}
