import axios from "axios";
import { ICustomerValidator } from "../../../domain/ports/usecases/ICustomerValidator";

export class HttpCustomerValidator implements ICustomerValidator {
  private readonly baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async validateCustomerExists(customerId: number, token?: string): Promise<boolean> {
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
      const response = await axios.get(`${this.baseUrl}/customers/internal/customers/${customerId}`, { headers });
      return response.status === 200;
    } catch (err: any) {
      if (err.response?.status === 404) return false;
      throw new Error("Error communicating with Customer Service");
    }
  }
}
