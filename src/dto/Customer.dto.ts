import { IsEmail, Length } from "class-validator";

export class CreateCustomerInputs {
  @IsEmail()
  email: string;

  @Length(7, 12)
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
  email: string;
  verified: boolean;
}
