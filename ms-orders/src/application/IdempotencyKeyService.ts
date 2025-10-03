import { IIdempotencyKeyUseCases } from "../domain/ports/usecases/IIdempotencyKeyUsecases";
import { IdempotencyKeyRepository } from "../domain/ports/repositories/IdempotencyKeyRepository";
import { IdempotencyKey } from "../domain/entities/IdempotencyKey";

export class IdempotencyKeyService implements IIdempotencyKeyUseCases {
  constructor(private readonly keyRepo: IdempotencyKeyRepository) {}

  async createKey(input: {
    key: string;
    targetType: string;
    targetId: string;
    status: string;
    responseBody: string;
    expiresAt: Date;
  }): Promise<IdempotencyKey> {
    const existing = await this.keyRepo.findByKey(input.key);
    if (existing) return existing;

    const key = IdempotencyKey.create(input);
    return this.keyRepo.save(key);
  }

  async getKey(key: string): Promise<IdempotencyKey | null> {
    return this.keyRepo.findByKey(key);
  }

  async updateKey(input: {
    key: string;
    status?: string;
    responseBody?: string;
    expiresAt?: Date;
  }): Promise<IdempotencyKey> {
    const existing = await this.keyRepo.findByKey(input.key);
    if (!existing) throw new Error(`Idempotency key ${input.key} not found`);

    if (input.status) existing.status = input.status;
    if (input.responseBody) existing.responseBody = input.responseBody;
    if (input.expiresAt) existing.expiresAt = input.expiresAt;

    await this.keyRepo.markAsUsed(existing.key, existing.responseBody);

    return existing;
  }
}
