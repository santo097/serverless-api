import { Request, Response, Router } from "express";
import { CustomerService } from "../../application/CustomerService";
import { TypeormCustomerRepository } from "../repositories/TypeormCustomerRepository";
import { serviceTokenMiddleware } from "../middleware/serviceTokenMiddleware";

const router = Router();

const customerRepository = new TypeormCustomerRepository();
const customerService = new CustomerService(customerRepository);

router.post("/", async (req: Request, res: Response) => {
  try {
    const customer = await customerService.createCustomer(req.body);
    res.status(201).json(customer.toPrimitives());
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});


router.get("/:id", async (req: Request, res: Response) => {
  try {
    const customer = await customerService.getCustomerById(Number(req.params.id));
    res.json(customer.toPrimitives());
  } catch (err: any) {
    if (err.message.includes("not found")) {
      return res.status(404).json({ error: err.message });
    }
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/internal/customers/:id", serviceTokenMiddleware, async (req: Request, res: Response) => {
  try {
    const customer = await customerService.getCustomerById(Number(req.params.id));
    if (!customer) return res.status(404).json({ error: "Customer not found" });

    res.json(customer.toPrimitives());
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/", async (_req: Request, res: Response) => {
  try {
    const customers = await customerService.listCustomers();
    res.json(customers.map((c) => c.toPrimitives()));
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/:id", async (req: Request, res: Response) => {
  try {
    const updated = await customerService.updateCustomer({
      id: Number(req.params.id),
      ...req.body,
    });

    if (!updated) {
      return res.status(404).json({ error: "Customer not found" });
    }

    res.json(updated.toPrimitives());
  } catch (err: any) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});



router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const deleted = await customerService.updateCustomer({
      id: Number(req.params.id),
      ...req.body,
    });

    if (!deleted) {
      return res.status(404).json({ error: "Customer not found" });
    }

    await customerService.deleteCustomer(Number(req.params.id));
    
    res.status(204).send();
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

export { router as customerRouter };
