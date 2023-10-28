import { Request, Response } from "express";
import { CreateVendorInput } from "../dto/Vendor.dto";
import { Vendor } from "../models";
import { passwordGenerator, saltGenerator } from "../utility";
import { SALT_NUM } from "../config";

export const FindVendor = async (id: string | undefined, email?: string) => {
  if (email) {
    return await Vendor.findOne({ email: email });
  } else {
    return await Vendor.findById(id);
  }
};

export const createVendor = async (req: Request, res: Response) => {
  const {
    name,
    ownerName,
    password,
    pincode,
    address,
    email,
    phone,
    foodType,
  } = <CreateVendorInput>req.body;

  const existingVendor = Boolean(await FindVendor("", email));

  if (existingVendor)
    return res.status(404).json({ msg: "A vendor is already exist..." });

  const salt = await saltGenerator(SALT_NUM);
  const hashedPassword = await passwordGenerator(password, salt);

  const newVendor = await Vendor.create({
    name,
    ownerName,
    password: hashedPassword,
    pincode,
    address,
    email,
    phone,
    salt: salt,
    foodType,
    serviceAvailable: false,
    coverImage: [],
    rating: 0,
    foods: [],
  });
  return res.json(newVendor);
};

export const getVendors = async (req: Request, res: Response) => {
  const vendors = await Vendor.find();

  if (vendors !== null) return res.status(200).json(vendors);

  return res.status(404).json({ msg: "vendors data is not available" });
};

export const getVendorById = async (req: Request, res: Response) => {
  const { id } = req.params;

  const vendor = await FindVendor(id);

  if (vendor !== null) return res.status(200).json(vendor);

  return res.status(404).json({ msg: "vendor's data not available" });
};
