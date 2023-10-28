import { Request, Response } from "express";
import { plainToClass } from "class-transformer";
import {
  CreateCustomerInputs,
  EditCustomerProfileInput,
  UserLoginInput,
} from "../dto/Customer.dto";
import { validate } from "class-validator";
import {
  generateSignature,
  passwordGenerator,
  saltGenerator,
  validPassword,
} from "../utility";
import { Customer } from "../models/customer";
import { generateOtp, requestOTP } from "../utility/notifications.util";

export const customerSignUp = async (req: Request, res: Response) => {
  const customerInputs = plainToClass(CreateCustomerInputs, req.body);
  const inputErrors = await validate(customerInputs, {
    validationError: { target: true },
  });

  if (inputErrors.length > 0) {
    return res.status(400).json(inputErrors);
  }
  const { password, phone, email } = customerInputs;

  const existingUser = await Customer.findOne({ email: email });
  if (existingUser) {
    return res
      .status(400)
      .json({ err: "User with this email is already exist..." });
  }
  const salt = await saltGenerator(13);
  const userPaasword = await passwordGenerator(password, salt);

  const { otp, expiry } = generateOtp();

  const result = await Customer.create({
    email: email,
    password: userPaasword,
    salt: salt,
    phone: phone,
    otp: otp,
    otp_expiry: expiry,
    firstName: "",
    lastName: "",
    address: "",
    verified: false,
    lat: 0,
    lng: 0,
  });

  if (result) {
    await requestOTP(otp, phone);
    const signature = generateSignature({
      _id: result._id,
      email: result.email,
      verified: result.verified,
    });
    return res.status(201).json({
      signature: signature,
      verfied: result.verified,
      email: result.email,
      _id: result._id,
    });
  }
  return res.status(400).json({ err: "Error with Sign up" });
};

export const customerLogin = async (req: Request, res: Response) => {
  const loginInput = plainToClass(UserLoginInput, req.body);
  const loginError = await validate(loginInput, {
    validationError: { target: false },
  });
  if (loginError.length > 0) {
    return res.status(400).json(loginError);
  }
  const { email, password } = loginInput;

  const customer = await Customer.findOne({ email: email });
  if (customer) {
    const validation = await validPassword(customer.password, password);
    if (validation) {
      const signature = generateSignature({
        _id: customer._id,
        email: customer.email,
        verified: customer.verified,
      });

      return res.status(201).json({
        signature: signature,
        email: customer.email,
        verified: customer.verified,
      });
    }
  }
  return res.status(400).json({ err: "Error with login" });
};
export const customerVerify = async (req: Request, res: Response) => {
  const { otp } = req.body;
  const customer = req.user;
  console.log({ otp, customer });
  if (customer) {
    const profile = await Customer.findById(customer._id);
    if (profile) {
      if (profile.otp === parseInt(otp) && profile.otp_expiry >= new Date()) {
        profile.verified = true;
        const updateCustomerResponce = await profile.save();
        const signature = generateSignature({
          _id: updateCustomerResponce._id,
          email: updateCustomerResponce.email,
          verified: updateCustomerResponce.verified,
        });

        return res.status(201).json({
          signature: signature,
          verfied: updateCustomerResponce.verified,
          email: updateCustomerResponce.email,
          _id: updateCustomerResponce._id,
        });
      }
    }
  }
  return res.status(400).json({ err: "Error with OTP validation" });
};

export const requestOtp = async (req: Request, res: Response) => {
  const customer = req.user;
  if (customer) {
    const profile = await Customer.findById(customer._id);
    if (profile) {
      const { otp, expiry } = generateOtp();
      profile.otp = otp;
      profile.otp_expiry = expiry;

      await profile.save();
      await requestOTP(otp, profile.phone);

      return res
        .status(200)
        .json({ msg: "OTP sent your registered phone number!" });
    }
  }
  return res.status(400).json({ err: "Error with Request OTp" });
};
export const getCustomerProfile = async (req: Request, res: Response) => {
  const customer = req.user;
  if (customer) {
    const profile = await Customer.findById(customer._id);

    if (profile) {
      res.status(200).json(profile);
    }
  }

  return res.status(400).json({ msg: "Error with Request User" });
};
export const editCustomerProfile = async (req: Request, res: Response) => {
  const customer = req.user;
  const profileInput = plainToClass(EditCustomerProfileInput, req.body);
  const profileError = await validate(profileInput, {
    validationError: { target: false },
  });

  if (profileError.length > 0) {
    return res.status(400).json(profileError);
  }

  const { firstname, lastname, address } = profileInput;
  if (customer) {
    const profile = await Customer.findById(customer._id);

    if (profile) {
      profile.firstName = firstname;
      profile.lastName = lastname;
      profile.address = address;

      const savedProfle = await profile.save();
      return res.status(200).json(savedProfle);
    }
  }

  return res.status(400).json({ msg: "Error with Edit User" });
};
