import { IsEmail, IsEmpty, Length } from "class-validator";

export class createCustomerInputs {
  @IsEmail()
  email: string;

  @Length(6, 12)
  password: string;

  @Length(7, 12)
  phone: string;
}
export class LoginCustomerInputs {
  @IsEmail()
  email: string;

  @Length(6, 12)
  password: string;
}
export class EditCustomerInputs {
  @Length(3, 16)
  firstName: string;

  @Length(3, 16)
  lastName: string;

  @Length(6, 16)
  address: string;
}

export interface CustomerPayload {
  _id: string;
  email: string;
  verified: boolean;
}

export interface OrderInputs {
  _id: string;
  unit: number;
}
