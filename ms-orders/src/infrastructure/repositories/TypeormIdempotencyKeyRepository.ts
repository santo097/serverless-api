import { Repository } from "typeorm";
import { AppDataSource } from "../external/db/data-source";
import { IdempotencyKeyEntity } from "../external/db/entities/IdempotencyKeyEntity";

import { IdempotencyKeyRepository } from "../../domain/ports/repositories/IdempotencyKeyRepository";
import { IdempotencyKey } from "../../domain/entities/IdempotencyKey";

export class TypeormIdempotencyKeyRepository implements IdempotencyKeyRepository {
  private ormRepo: Repository<IdempotencyKeyEntity>;

  constructor() {
    this.ormRepo = AppDataSource.getRepository(IdempotencyKeyEntity);
  }

  async save(key: IdempotencyKey): Promise<IdempotencyKey> {
    const primitives = key.toPrimitives();
    const entity = this.ormRepo.create({
      key: primitives.key,
      targetType: primitives.targetType,
      targetId: primitives.targetId,
      status: primitives.status,
      responseBody: primitives.responseBody,
      createdAt: primitives.createdAt,
      expiresAt: primitives.expiresAt,
    });
    const saved = await this.ormRepo.save(entity);
    return IdempotencyKey.fromPrimitives(saved);
  }

  async findByKey(key: string): Promise<IdempotencyKey | null> {
    const found = await this.ormRepo.findOneBy({ key });
    return found ? IdempotencyKey.fromPrimitives(found) : null;
  }

  async markAsUsed(key: string, responseBody: any): Promise<void> {
    await this.ormRepo.update(
      { key },
      { responseBody: typeof responseBody === "string" ? responseBody : JSON.stringify(responseBody) }
    );
  }
}
