import { Request, Response } from "express";
import { CreateVendorInput } from "../dto/Vendor.dto";
import { Vendor } from "../models";
import { passwordGenerator, saltGenerator } from "../utility";
import { SALT_NUM } from "../config";
import { Transaction } from "../models/transaction";
import { DeliveryUser } from "../models/delivery";

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
    lat,
    lng,
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
    status: "Vendor",
    salt: salt,
    foodType: foodType.split(", "),
    serviceAvailable: false,
    coverImage: [],
    rating: 1520,
    foods: [],
    lat,
    lng,
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

export const getTxns = async (req: Request, res: Response) => {
  const transactions = await Transaction.find();

  if (transactions.length > 0) return res.status(200).json(transactions);

  return res.status(404).json({ msg: "txns not available" });
};

export const getTxnsById = async (req: Request, res: Response) => {
  const { id } = req.params;

  const txn = await Transaction.findById(id);
  if (txn !== null) return res.status(200).json(txn);

  return res.status(404).json({ msg: "txn not available" });
};

export const verifyDeliveryUser = async (req: Request, res: Response) => {
  const { _id, status } = req.body;

  if (_id) {
    const profile = await DeliveryUser.findById(_id);

    if (profile) {
      profile.verified = status;
      const savedProfle = await profile.save();

      return res.status(200).json(savedProfle);
    }
  }

  return res.status(400).json({ msg: "Unable to verify Devlivery user" });
};

export const getDeliveryUsers = async (req: Request, res: Response) => {
  const deliveryUSer = await DeliveryUser.find();

  if (deliveryUSer) return res.status(200).json(deliveryUSer);
  return res.status(400).json({ msg: "Unable to get Devlivery users" });
};
