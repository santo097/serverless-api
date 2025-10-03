import { IServiceTokenValidator } from "../../domain/ports/usecases/IServiceTokenValidator";
import { env } from "../config/env";

export class ServiceTokenValidator implements IServiceTokenValidator {
  async validate(token: string): Promise<boolean> {
    return token === env.auth.serviceToken;
  }
}
