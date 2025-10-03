import "reflect-metadata";
import { DataSource } from "typeorm";
import { env } from "../../config/env";

// Entities
import { ProductEntity } from "./entities/ProductEntity";
import { OrderEntity } from "./entities/OrderEntity";
import { OrderItemEntity } from "./entities/OrderItemEntity";
import { IdempotencyKeyEntity } from "./entities/IdempotencyKeyEntity";

export const AppDataSource = new DataSource({
  type: env.db.type as any, // mysql
  host: env.db.host,
  port: env.db.port,
  username: env.db.username,
  password: env.db.password,
  database: env.db.database,
  synchronize: true, // ⚠️ Solo para dev. En prod usa migrations.
  logging: false,
  entities: [
    ProductEntity,
    OrderEntity,
    OrderItemEntity,
    IdempotencyKeyEntity,
  ],
  migrations: [],
  subscribers: [],
});

