import { Request, Response } from "express";
import { EditVendorInput, VendorLoginInput } from "../dto/Vendor.dto";
import { FindVendor } from "./admin.controller";
import { generateSignature, validPassword } from "../utility";
import { CreateFoodInput } from "../dto/Food.dto";
import { Food } from "../models";

export const vendorLogin = async (req: Request, res: Response) => {
  const { email, password } = <VendorLoginInput>req.body;

  const existingVendo = await FindVendor("", email);

  if (existingVendo !== null) {
    const validUser = await validPassword(existingVendo.password, password);

    if (validUser) {
      const signature = generateSignature({
        _id: existingVendo._id,
        email: existingVendo.email,
        password: existingVendo.password,
        name: existingVendo.name,
        ownerName: existingVendo.ownerName,
      });
      return res.status(200).json(signature);
    } else {
      return res.status(403).json({ msg: "Wrong credentials" });
    }
  } else {
    return res.status(403).json({ msg: "User not found" });
  }
};
export const getVendorProfile = async (req: Request, res: Response) => {
  const user = req.user;

  if (user) {
    return res.status(200).json(user);
  } else {
    return res
      .status(403)
      .json({ msg: "You have not the permission to received this data" });
  }
};
export const updateVendorProfile = async (req: Request, res: Response) => {
  const { name, ownerName, phone, address } = <EditVendorInput>req.body;
  const user = req.user;

  if (user) {
    const existingVendo = await FindVendor(user._id);

    if (existingVendo !== null) {
      existingVendo.name = name;
      existingVendo.ownerName = ownerName;
      existingVendo.phone = phone;
      existingVendo.address = address;

      const savedResult = await existingVendo.save();
      return res.json(savedResult);
    }
    return res.status(200).json(existingVendo);
  } else {
    return res
      .status(403)
      .json({ msg: "You have not the permission to received this data" });
  }
};

export const updateVendomCoverImage = async (req: Request, res: Response) => {
  const user = req.user;

  const { name, desc, cat, foodType, readyTime, price } = <CreateFoodInput>(
    req.body
  );

  if (user) {
    const vendor = await FindVendor(user._id);

    if (vendor !== null) {
      const files = req.files as [Express.Multer.File];
      const images = files.map((file: Express.Multer.File) => file.filename);
      vendor.foods.push(...images);
      const savedUpdatedVendor = await vendor.save();
      return res.json(savedUpdatedVendor);
    }
  }
  return res.json({ message: "Unable to Update vendor profile " });
};

export const updateVendorService = async (req: Request, res: Response) => {
  const user = req.user;

  if (user) {
    const existingVendo = await FindVendor(user._id);
    if (existingVendo !== null) {
      existingVendo.serviceAvailable = !existingVendo.serviceAvailable;
      const savedResult = await existingVendo.save();
      return res.json(savedResult);
    }
    return res.status(200).json(existingVendo);
  } else {
    return res
      .status(403)
      .json({ msg: "You have not the permission to received this data" });
  }
};

export const addFood = async (req: Request, res: Response) => {
  const user = req.user;

  const { name, desc, cat, foodType, readyTime, price } = <CreateFoodInput>(
    req.body
  );
  if (user) {
    const vendor = await FindVendor(user._id);

    if (vendor !== null) {
      const files = req.files as [Express.Multer.File];
      const images = files.map((file: Express.Multer.File) => file.filename);

      const food = await Food.create({
        vendorId: vendor._id,
        name: name,
        description: desc,
        category: cat,
        price: price,
        rating: 0,
        readyTime: readyTime,
        foodType: foodType,
        images: images,
      });

      vendor.foods.push(food);
      const savedVendor = await vendor.save();
      return res.json(savedVendor);
    }
  }
  return res.json({ message: "Unable to Update vendor profile " });
};

export const getFoods = async (req: Request, res: Response) => {
  const user = req.user;

  if (user) {
    const foods = await Food.find({ vendorId: user._id });

    if (foods !== null) {
      return res.json(foods);
    }
  }
  return res.json({ message: "Foods not found!" });
};
