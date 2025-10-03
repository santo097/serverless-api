import { IdempotencyKey } from "../../entities/IdempotencyKey";

export interface IdempotencyKeyRepository {
  save(key: IdempotencyKey): Promise<IdempotencyKey>;
  findByKey(key: string): Promise<IdempotencyKey | null>;
  markAsUsed(key: string, responseBody: any): Promise<void>;
}
