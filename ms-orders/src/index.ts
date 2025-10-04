import "reflect-metadata";
import express, { Application } from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";

import { AppDataSource } from "./infrastructure/external/db/data-source";
import { env } from "./infrastructure/config/env";

import { productRouter } from "./infrastructure/controllers/ProductController";
import { orderRouter } from "./infrastructure/controllers/OrderController";

dotenv.config();

async function bootstrap() {
  try {
    // Inicializar base de datos
    await AppDataSource.initialize();
    console.log("✅ Database connected successfully");

    const app: Application = express();

    // Middlewares globales
    app.use(helmet());
    app.use(cors());
    app.use(express.json());
    app.use(morgan("dev"));

    // Healthcheck
    app.get("/health", (_, res) => {
      res.json({
        status: "ok",
        service: process.env.SERVICE_NAME || "orders-api",
      });
    });

    // Rutas de negocio
    app.use("/products", productRouter);
    app.use("/orders", orderRouter);


    app.use((req, res) => {
      res.status(404).json({ error: "Route not found" });
    });


    // Levantar servidor
    app.listen(env.app.port, () => {
      console.log(` ${process.env.SERVICE_NAME || "orders-api"} running on port ${env.app.port}`);
    });
  } catch (err) {
    console.error(" Failed to start application", err);
    process.exit(1);
  }
}

bootstrap();
