export class CustomerNotFoundError extends Error {
  constructor(customerId: number) {
    super(`Customer with id ${customerId} not found`);
    this.name = "CustomerNotFoundError";
  }
}
