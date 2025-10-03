export class IdempotencyKey {
  private constructor(
    public readonly key: string,
    public targetType: string,
    public targetId: string,
    public status: string,
    public responseBody: string,
    public readonly createdAt: Date,
    public expiresAt: Date
  ) {}

  static create(props: {
    key: string;
    targetType: string;
    targetId: string;
    status: string;
    responseBody: string;
    createdAt?: Date;
    expiresAt: Date;
  }): IdempotencyKey {
    return new IdempotencyKey(
      props.key,
      props.targetType,
      props.targetId,
      props.status,
      props.responseBody,
      props.createdAt ?? new Date(),
      props.expiresAt
    );
  }

  static fromPrimitives(plain: {
    key: string;
    targetType: string;
    targetId: string;
    status: string;
    responseBody: string;
    createdAt: Date;
    expiresAt: Date;
  }): IdempotencyKey {
    return new IdempotencyKey(
      plain.key,
      plain.targetType,
      plain.targetId,
      plain.status,
      plain.responseBody,
      plain.createdAt,
      plain.expiresAt
    );
  }

  toPrimitives() {
    return {
      key: this.key,
      targetType: this.targetType,
      targetId: this.targetId,
      status: this.status,
      responseBody: this.responseBody,
      createdAt: this.createdAt,
      expiresAt: this.expiresAt,
    };
  }
}
