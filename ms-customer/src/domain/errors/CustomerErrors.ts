export class CustomerEmailAlreadyExistsError extends Error {
  constructor(email: string) {
    super(`Customer with email ${email} already exists`);
    this.name = "CustomerEmailAlreadyExistsError";
  }
}

export class CustomerNotFoundError extends Error {
  constructor(id: string) {
    super(`Customer with id ${id} not found`);
    this.name = "CustomerNotFoundError";
  }
}