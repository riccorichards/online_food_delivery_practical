import { Request, Response } from "express";
import { plainToClass } from "class-transformer";
import {
  CreateDeiveryUserInputs,
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
import { DeliveryUser } from "../models/delivery";

export const deliverySignUp = async (req: Request, res: Response) => {
  const deliveryUser = plainToClass(CreateDeiveryUserInputs, req.body);
  const inputErrors = await validate(deliveryUser, {
    validationError: { target: true },
  });

  if (inputErrors.length > 0) {
    return res.status(400).json(inputErrors);
  }
  const { password, phone, email, firstname, lastname, address, pincode } =
    deliveryUser;

  const existingDeliveryUser = await DeliveryUser.findOne({ email: email });
  if (existingDeliveryUser) {
    return res
      .status(400)
      .json({ err: "A delivery User with this email is already exist..." });
  }
  const salt = await saltGenerator(13);
  const userPaasword = await passwordGenerator(password, salt);

  const result = await DeliveryUser.create({
    email: email,
    password: userPaasword,
    salt: salt,
    phone: phone,
    firstName: firstname,
    lastName: lastname,
    pincode: pincode,
    address: address,
    verified: false,
    lat: 0,
    lng: 0,
    orders: [],
    isAvailable: false,
  });

  if (result) {
    const signature = generateSignature({
      _id: result._id,
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

export const deliveryLogin = async (req: Request, res: Response) => {
  const loginInput = plainToClass(UserLoginInput, req.body);
  const loginError = await validate(loginInput, {
    validationError: { target: false },
  });
  if (loginError.length > 0) {
    return res.status(400).json(loginError);
  }
  const { email, password } = loginInput;

  const deliveryUser = await DeliveryUser.findOne({ email: email });
  if (deliveryUser) {
    const validation = await validPassword(deliveryUser.password, password);
    if (validation) {
      const signature = generateSignature({
        _id: deliveryUser._id,
        verified: deliveryUser.verified,
      });

      return res.status(201).json({
        signature: signature,
        email: deliveryUser.email,
        verified: deliveryUser.verified,
      });
    }
  }
  return res.status(400).json({ err: "Error with login" });
};

export const getDeliveryProfile = async (req: Request, res: Response) => {
  const deliveryUser = req.user;
  if (deliveryUser) {
    const profile = await DeliveryUser.findById(deliveryUser._id);

    if (profile) {
      return res.status(200).json(profile);
    }
  }

  return res.status(400).json({ msg: "Error with Request User" });
};
export const editDeliveryProfile = async (req: Request, res: Response) => {
  const deliveryUser = req.user;
  const profileInput = plainToClass(EditCustomerProfileInput, req.body);
  const profileError = await validate(profileInput, {
    validationError: { target: false },
  });

  if (profileError.length > 0) {
    return res.status(400).json(profileError);
  }

  const { firstname, lastname, address } = profileInput;
  if (deliveryUser) {
    const profile = await DeliveryUser.findById(deliveryUser._id);

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

export const updateDeliveryUserStatus = async (req: Request, res: Response) => {
  const deliveryUser = req.user;

  if (deliveryUser) {
    const { lat, lng } = req.body;

    const profile = await DeliveryUser.findById(deliveryUser._id);

    if (profile) {
      if (lat && lng) {
        profile.lat = lat;
        profile.lng = lng;
      }

      profile.isAvailable = !profile.isAvailable;

      const savedProfle = await profile.save();

      return res.status(200).json(savedProfle);
    }
  }

  return res.status(400).json({ msg: "Offer is not valid" });
};
