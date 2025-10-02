import { Customer } from "../../entities/Customer";

export interface ICustomerRepository {
  findById(id: number): Promise<Customer | null>;
  findByEmail(email: string): Promise<Customer | null>;
  save(customer: Customer): Promise<Customer>;
  update(customer: Customer): Promise<Customer>;
  delete(id: number): Promise<void>;
  list(): Promise<Customer[]>;
}