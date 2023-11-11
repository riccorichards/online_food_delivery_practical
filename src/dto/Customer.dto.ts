import { IsEmail, Length } from "class-validator";

export class CreateCustomerInputs {
  @IsEmail()
  email: string;

  @Length(7, 15)
  phone: string;

  @Length(7, 12)
  password: string;
}

export class UserLoginInput {
  @IsEmail()
  email: string;

  @Length(7, 12)
  password: string;
}

export class EditCustomerProfileInput {
  @Length(3, 16)
  firstname: string;

  @Length(3, 16)
  lastname: string;

  @Length(6, 16)
  address: string;
}

export interface CustomerPayload {
  _id: string;
  verified: boolean;
}

export class CartItem {
  _id: string;

  unit: number;
}

export class OrderInput {
  txnId: string;

  amount: string;

  items: [CartItem];
}

export class CreateDeiveryUserInputs {
  @IsEmail()
  email: string;

  @Length(7, 25)
  phone: string;

  @Length(7, 12)
  password: string;

  @Length(3, 12)
  firstname: string;

  @Length(3, 12)
  lastname: string;

  @Length(5, 12)
  address: string;

  @Length(4, 12)
  pincode: string;
}
