import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Unique } from "typeorm";

@Entity("products")
@Unique(["sku"])
export class ProductEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 50 })
  sku!: string;

  @Column({ type: "varchar", length: 255 })
  name!: string;

  @Column({ name: "price_cents", type: "int" })
  priceCents!: number;

  @Column({ type: "int" })
  stock!: number;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;
}
