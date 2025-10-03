import { Repository } from "typeorm";
import { ICustomerRepository } from "../../domain/ports/repositories/ICustomerRepository";
import { Customer } from "../../domain/entities/Customer";
import { CustomerEntity } from "../external/db/entities/CustomerEntity";
import { AppDataSource } from "../external/db/data-source";

export class TypeormCustomerRepository implements ICustomerRepository {
  private ormRepo: Repository<CustomerEntity>;

  constructor() {
    this.ormRepo = AppDataSource.getRepository(CustomerEntity);
  }

  async create(customer: Customer): Promise<Customer> {
    const primitives = customer.toPrimitives();
    const entity = this.ormRepo.create(primitives);
    const saved = await this.ormRepo.save(entity);

    return Customer.fromPrimitives({
      id: saved.id,
      name: saved.name,
      email: saved.email,
      phone: saved.phone,
      createdAt: saved.createdAt,
    });
  }

  async findById(id: number): Promise<Customer | null> {
    const found = await this.ormRepo.findOneBy({ id });
    return found
      ? Customer.fromPrimitives({
          id: found.id,
          name: found.name,
          email: found.email,
          phone: found.phone,
          createdAt: found.createdAt,
        })
      : null;
  }

  async findByEmail(email: string): Promise<Customer | null> {
    const found = await this.ormRepo.findOneBy({ email });
    return found
      ? Customer.fromPrimitives({
          id: found.id,
          name: found.name,
          email: found.email,
          phone: found.phone,
          createdAt: found.createdAt,
        })
      : null;
  }

  async list(): Promise<Customer[]> {
    const all = await this.ormRepo.find();
    return all.map((c) =>
      Customer.fromPrimitives({
        id: c.id,
        name: c.name,
        email: c.email,
        phone: c.phone,
        createdAt: c.createdAt,
      })
    );
  }

  async save(customer: Customer): Promise<Customer> {
    const primitives = customer.toPrimitives();
    const saved = await this.ormRepo.save(primitives);
    return Customer.create(saved);
  }

async update(customer: Customer): Promise<Customer> {
  const primitives = customer.toPrimitives();
  await this.ormRepo.update(primitives.id, primitives);
  const updated = await this.ormRepo.findOneBy({ id: primitives.id });
  if (!updated) {
    throw new Error(`Customer with id ${primitives.id} not found`);
  }
  return Customer.create(updated);
}

async delete(id: number): Promise<void> {
  await this.ormRepo.delete(id);
}
}