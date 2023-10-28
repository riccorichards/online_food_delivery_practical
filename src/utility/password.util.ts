import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { VendorPayload } from "../dto/Vendor.dto";
import { JWT_PRIVATE_KEY } from "../config";
import { Request } from "express";
import { AuthPayload } from "../dto/Auth.dto";

export const saltGenerator = (n: number) => {
  return bcrypt.genSalt(n);
};

export const passwordGenerator = (password: string, salt: string) => {
  return bcrypt.hash(password, salt);
};

export const validPassword = async (enteredPass: string, existPass: string) => {
  return await bcrypt.compare(existPass, enteredPass);
};

export const generateSignature = (payload: AuthPayload) => {
  return jwt.sign(payload, JWT_PRIVATE_KEY, { expiresIn: "1d" });
};

export const validateSignature = (req: Request) => {
  const signature = req.get("Authorization");
  if (signature) {
    const payload = jwt.verify(signature.split(" ")[1], JWT_PRIVATE_KEY);

    return payload as VendorPayload;
  }
  return undefined;
};
