import { Request, Response, Router } from "express";
import { IdempotencyKeyService } from "../../application/IdempotencyKeyService";
import { TypeormIdempotencyKeyRepository } from "../repositories/TypeormIdempotencyKeyRepository";

const router = Router();

// Inyección de dependencias
const idemRepo = new TypeormIdempotencyKeyRepository();
const idemService = new IdempotencyKeyService(idemRepo);

// Crear idempotency key
router.post("/", async (req: Request, res: Response) => {
  try {
    const key = await idemService.createKey(req.body);
    res.status(201).json(key.toPrimitives());
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Obtener idempotency key
router.get("/:key", async (req: Request, res: Response) => {
  try {
    const key = await idemService.getKey(req.params.key);
    if (!key) {
      return res.status(404).json({ error: "Idempotency key not found" });
    }
    res.json(key.toPrimitives());
  } catch (err: any) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Actualizar idempotency key
router.put("/:key", async (req: Request, res: Response) => {
  try {
    const updated = await idemService.updateKey({
      key: req.params.key,
      ...req.body,
    });
    res.json(updated.toPrimitives());
  } catch (err: any) {
    if (err.message.includes("not found")) {
      return res.status(404).json({ error: err.message });
    }
    res.status(400).json({ error: err.message });
  }
});

export { router as idempotencyKeyRouter };
