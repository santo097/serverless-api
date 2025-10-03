export class OrderItemNotFoundError extends Error {
  constructor(id: number) {
    super(`Order item with id ${id} not found`);
    this.name = "OrderItemNotFoundError";
  }
}

export class OrderItemInvalidQuantityError extends Error {
  constructor(qty: number) {
    super(`Invalid quantity: ${qty}`);
    this.name = "OrderItemInvalidQuantityError";
  }
}
