import { IdempotencyKey } from "../../entities/IdempotencyKey";

export interface IIdempotencyKeyUseCases {
  createKey(input: {
    key: string;
    targetType: string;
    targetId: string;
    status: string;
    responseBody: string;
    expiresAt: Date;
  }): Promise<IdempotencyKey>;

  getKey(key: string): Promise<IdempotencyKey | null>;

  updateKey(input: {
    key: string;
    status?: string;
    responseBody?: string;
    expiresAt?: Date;
  }): Promise<IdempotencyKey>;
}
