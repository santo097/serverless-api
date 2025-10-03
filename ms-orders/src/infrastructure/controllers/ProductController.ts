import { Request, Response, Router } from "express";
import { ProductService } from "../../application/ProductService";
import { TypeormProductRepository } from "../repositories/TypeormProductRepository";

const router = Router();

// Inyección de dependencias
const productRepository = new TypeormProductRepository();
const productService = new ProductService(productRepository);

// Crear producto
router.post("/", async (req: Request, res: Response) => {
  try {
    const product = await productService.createProduct(req.body);
    res.status(201).json(product.toPrimitives());
  } catch (err: any) {
    if (err.name === "ProductSkuAlreadyExistsError") {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Obtener producto por ID
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const product = await productService.getProductById(Number(req.params.id));
    res.json(product.toPrimitives());
  } catch (err: any) {
    if (err.name === "ProductNotFoundError") {
      return res.status(404).json({ error: err.message });
    }
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Listar productos con filtros (search, cursor, limit)
router.get("/", async (req: Request, res: Response) => {
  try {
    const { search, cursor, limit } = req.query;
    const products = await productService.listProducts({
      search: search as string,
      cursor: cursor ? Number(cursor) : undefined,
      limit: limit ? Number(limit) : undefined,
    });
    res.json(products.map((p) => p.toPrimitives()));
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Actualizar precio o stock de un producto
router.patch("/:id", async (req: Request, res: Response) => {
  try {
    const updated = await productService.updateProduct({
      id: Number(req.params.id),
      priceCents: req.body.priceCents,
      stock: req.body.stock,
    });
    res.json(updated.toPrimitives());
  } catch (err: any) {
    if (err.name === "ProductNotFoundError") {
      return res.status(404).json({ error: err.message });
    }
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Eliminar producto
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    await productService.deleteProduct(Number(req.params.id));
    res.status(204).send();
  } catch (err: any) {
    if (err.name === "ProductNotFoundError") {
      return res.status(404).json({ error: err.message });
    }
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export { router as productRouter };
