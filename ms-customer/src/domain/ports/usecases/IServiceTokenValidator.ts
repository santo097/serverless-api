export interface IServiceTokenValidator {
  validate(token: string): Promise<boolean>;
}