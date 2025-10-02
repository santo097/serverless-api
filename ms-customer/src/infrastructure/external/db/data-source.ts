import "reflect-metadata";
import { DataSource } from "typeorm";
import { env } from "../../config/env";
import { CustomerEntity } from "./entities/CustomerEntity";

export const AppDataSource = new DataSource({
  type: env.db.type as any,  
  host: env.db.host,
  port: env.db.port,
  username: env.db.username,
  password: env.db.password,
  database: env.db.database,
  synchronize: true, // ⚠️ Development environment
  logging: false,
  entities: [CustomerEntity],
  migrations: [],
  subscribers: [],
});
