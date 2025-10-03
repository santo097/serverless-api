
export interface ICustomerValidator {
  validateCustomerExists(customerId: number, token: string): Promise<boolean>;
}
