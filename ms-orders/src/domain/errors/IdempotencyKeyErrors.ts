export class IdempotencyKeyAlreadyExistsError extends Error {
  constructor(key: string) {
    super(`Idempotency key ${key} already exists`);
    this.name = "IdempotencyKeyAlreadyExistsError";
  }
}

export class IdempotencyKeyExpiredError extends Error {
  constructor(key: string) {
    super(`Idempotency key ${key} has expired`);
    this.name = "IdempotencyKeyExpiredError";
  }
}

export class IdempotencyKeyNotFoundError extends Error {
  constructor(key: string) {
    super(`Idempotency key ${key} not found`);
    this.name = "IdempotencyKeyNotFoundError";
  }
}
