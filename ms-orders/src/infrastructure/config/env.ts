// src/config/env.ts
import dotenv from "dotenv";

dotenv.config();

export const env = {
  app: {
    port: process.env.APP_PORT || 3002,
  },
  db: {
    type: process.env.DB_TYPE || "mysql",
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 3306,
    username: process.env.DB_USERNAME || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "test",
  },
  services: {
    customer: {
      url: process.env.CUSTOMER_SERVICE_URL || "http://localhost:3000",
    },
  },
};
