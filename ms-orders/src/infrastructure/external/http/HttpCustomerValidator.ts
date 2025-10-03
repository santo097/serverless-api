import axios from "axios";
import { ICustomerValidator } from "../../../domain/ports/usecases/ICustomerValidator";
import { env } from "../../config/env";

export class HttpCustomerValidator implements ICustomerValidator {
  private readonly baseUrl: string;

  constructor() {
    this.baseUrl = env.services.customer.url;
  }

  async validateCustomerExists(customerId: number): Promise<boolean> {
    try {
      const response = await axios.get(`${this.baseUrl}/customers/${customerId}`);
      return response.status === 200;
    } catch (err: any) {
      if (err.response?.status === 404) return false;
      throw new Error("Error communicating with Customer Service");
    }
  }
}
