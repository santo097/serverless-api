import { Request, Response, Router } from "express";
import { OrderService } from "../../application/OrdersService";
import { TypeormOrderRepository } from "../repositories/TypeormOrderRepository";
import { TypeormProductRepository } from "../repositories/TypeormProductRepository";
import { TypeormIdempotencyKeyRepository } from "../repositories/TypeormIdempotencyKeyRepository";
import { IdempotencyKeyService } from "../../application/IdempotencyKeyService";
import { HttpCustomerValidator } from "../external/http/HttpCustomerValidator";
import { env } from "../config/env";

const router = Router();

// Inyección de dependencias
const orderRepository = new TypeormOrderRepository();
const productRepository = new TypeormProductRepository();
const idempotencyRepo = new TypeormIdempotencyKeyRepository();
const idempotencyService = new IdempotencyKeyService(idempotencyRepo);
const httpCustomerValidator = new HttpCustomerValidator(env.services.customer.url);

const orderService = new OrderService(
  orderRepository,
  productRepository,
  idempotencyService,
  httpCustomerValidator
);

// Crear orden
router.post("/", async (req: Request, res: Response) => {
  try {

    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res.status(401).json({ error: "Authorization header missing" });
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Bearer token missing" });
    }

    const order = await orderService.createOrder(req.body, token);
    res.status(201).json(order.toPrimitives());
  } catch (err: any) {
    if (err.message.includes("Customer not found")) {
      return res.status(404).json({ error: err.message });
    }
    if (err.message.includes("Error communicating with Customer Service")) {
      return res.status(502).json({ error: err.message });
    }
    res.status(400).json({ error: err.message });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const order = await orderService.getOrderById(Number(req.params.id));
    res.json(order.toPrimitives());
  } catch (err: any) {
    if (err.name === "OrderNotFoundError") {
      return res.status(404).json({ error: err.message });
    }
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Listar órdenes con filtros
router.get("/", async (req: Request, res: Response) => {
  try {
    const { status, from, to, cursor, limit } = req.query;

    const orders = await orderService.listOrders({
      status: status as any,
      from: from ? new Date(from as string) : undefined,
      to: to ? new Date(to as string) : undefined,
      cursor: cursor ? Number(cursor) : undefined,
      limit: limit ? Number(limit) : undefined,
    });

    res.json(orders.map((o) => o.toPrimitives()));
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});


router.post("/:id/confirm", async (req: Request, res: Response) => {
  try {
    const idempotencyKey = req.headers["idempotency-key"] as string;
    if (!idempotencyKey) {
      return res.status(400).json({ error: "Idempotency-Key header is required" });
    }

    const confirmed = await orderService.confirmOrder(
      Number(req.params.id),
      idempotencyKey
    );
    res.json(confirmed.toPrimitives());
  } catch (err: any) {
    if (err.name === "OrderNotFoundError") {
      return res.status(404).json({ error: err.message });
    }
    res.status(400).json({ error: err.message });
  }
});

// Cancelar orden
router.post("/:id/cancel", async (req: Request, res: Response) => {
  try {
    const canceled = await orderService.cancelOrder(Number(req.params.id));
    res.json(canceled.toPrimitives());
  } catch (err: any) {
    if (err.name === "OrderNotFoundError") {
      return res.status(404).json({ error: err.message });
    }
    res.status(400).json({ error: err.message });
  }
});

export { router as orderRouter };
