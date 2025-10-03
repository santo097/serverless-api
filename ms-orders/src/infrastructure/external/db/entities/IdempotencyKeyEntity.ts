import { Entity, PrimaryColumn, Column, CreateDateColumn } from "typeorm";

@Entity("idempotency_keys")
export class IdempotencyKeyEntity {
  @PrimaryColumn({ type: "varchar", length: 255 })
  key!: string; // PK único

  @Column({ name: "target_type", type: "varchar", length: 100 })
  targetType!: string;

  @Column({ name: "target_id", type: "varchar", length: 100 })
  targetId!: string;

  @Column({ type: "varchar", length: 50 })
  status!: string;

  @Column({ name: "response_body", type: "text" })
  responseBody!: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @Column({ name: "expires_at", type: "datetime" })
  expiresAt!: Date;
}
