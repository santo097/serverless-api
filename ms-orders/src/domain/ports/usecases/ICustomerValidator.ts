
export interface ICustomerValidator {
  validateCustomerExists(customerId: number): Promise<boolean>;
}
