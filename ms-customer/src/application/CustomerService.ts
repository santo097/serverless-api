import { ICustomerUseCases } from "../domain/ports/usecases/ICustomerUseCases";
import { ICustomerRepository } from "../domain/ports/repositories/ICustomerRepository";
import { Customer } from "../domain/entities/Customer";
import { CustomerNotFoundError, CustomerEmailAlreadyExistsError } from "../domain/errors/CustomerErrors";

export class CustomerService implements ICustomerUseCases {
  constructor(private readonly customerRepo: ICustomerRepository) {}

  async createCustomer(input: { name: string; email: string; phone: string }): Promise<Customer> {
    const existing = await this.customerRepo.findByEmail(input.email);
    if (existing) throw new CustomerEmailAlreadyExistsError(input.email);

    const customer = Customer.create({
      name: input.name,
      email: input.email,
      phone: input.phone,
    });

    return this.customerRepo.save(customer);
  }

  async getCustomerById(id: number): Promise<Customer> {
    const customer = await this.customerRepo.findById(id);
    if (!customer) throw new CustomerNotFoundError(id.toString());
    return customer;
  }

  async listCustomers(): Promise<Customer[]> {
    return this.customerRepo.list();
  }

async updateCustomer(input: { id: number; name?: string; email?: string; phone?: string }): Promise<Customer | null> {
  const existing = await this.customerRepo.findById(input.id);
  if (!existing) return null;

  if (input.name) existing.name = input.name;
  if (input.email) existing.email = input.email;
  if (input.phone) existing.phone = input.phone;

  return await this.customerRepo.update(existing);
}


  async deleteCustomer(id: number): Promise<void> {
  const existing = await this.customerRepo.findById(id);
  if (!existing) return null;

  return await this.customerRepo.delete(id);
  }
}
