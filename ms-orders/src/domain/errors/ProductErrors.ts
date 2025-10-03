export class ProductNotFoundError extends Error {
  constructor(id: number) {
    super(`Product with id ${id} not found`);
    this.name = "ProductNotFoundError";
  }
}

export class ProductOutOfStockError extends Error {
  constructor(sku: string) {
    super(`Product with sku ${sku} is out of stock`);
    this.name = "ProductOutOfStockError";
  }
}

export class ProductSkuAlreadyExistsError extends Error {
  constructor(sku: string) {
    super(`Product with sku ${sku} already exists`);
    this.name = "ProductSkuAlreadyExistsError";
  }
}
