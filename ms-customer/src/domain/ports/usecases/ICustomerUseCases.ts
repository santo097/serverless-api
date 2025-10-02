import { Customer } from "../../entities/Customer";

export interface ICustomerUseCases {
  createCustomer(input: { name: string; email: string; phone: string }): Promise<Customer>;
  getCustomerById(id: number): Promise<Customer>;
  listCustomers(): Promise<Customer[]>;
  updateCustomer(input: Partial<Customer> & { id: number }): Promise<Customer>;
  deleteCustomer(id: number): Promise<void>;
}