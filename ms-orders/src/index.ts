import "reflect-metadata";
import express, { Application } from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";

dotenv.config();

const app = express();
app.use(express.json());
const PORT = process.env.PORT;

async function bootstrap() {
  try {

    const app: Application = express();

    // Middlewares
    app.use(helmet());
    app.use(cors());
    app.use(express.json());
    app.use(morgan("dev"));


    app.get("/health", (_, res) => {
      res.json({ status: "ok", service: process.env.SERVICE_NAME || "customers-api" });
    });
    
    app.listen(PORT, () => {
      console.log(`🚀 ${process.env.SERVICE_NAME} running on port ${PORT}`);
    });

    } catch (err) {
    console.error("Failed to start application", err);
    process.exit(1);
  }
}

bootstrap();

