// infrastructure/external/db/entities/CustomerEntity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Unique } from "typeorm";

@Entity("customers")
@Unique(["email"])
export class CustomerEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 100 })
  name!: string;

  @Column({ type: "varchar", length: 100 })
  email!: string;

  @Column({ type: "varchar", length: 20, nullable: true })
  phone: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;
}
