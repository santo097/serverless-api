export class OrderNotFoundError extends Error {
  constructor(id: number) {
    super(`Order with id ${id} not found`);
    this.name = "OrderNotFoundError";
  }
}

export class OrderInvalidStatusError extends Error {
  constructor(status: string) {
    super(`Order status ${status} is invalid`);
    this.name = "OrderInvalidStatusError";
  }
}

export class OrderTotalMismatchError extends Error {
  constructor(orderId: number) {
    super(`Order ${orderId} total does not match sum of items`);
    this.name = "OrderTotalMismatchError";
  }
}

export class OrderAlreadyConfirmedError extends Error {
  constructor(id: number) {
    super(`Order with id ${id} is already confirmed`);
    this.name = "OrderAlreadyConfirmedError";
  }
}
