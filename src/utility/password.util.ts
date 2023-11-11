import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { VendorPayload } from "../dto/Vendor.dto";
import { Request } from "express";
import { AuthPayload } from "../dto/Auth.dto";
import dotenv from "dotenv";

dotenv.config();
export const saltGenerator = (n: number) => {
  return bcrypt.genSalt(n);
};

export const passwordGenerator = (password: string, salt: string) => {
  return bcrypt.hash(password, salt);
};

export const validPassword = async (enteredPass: string, existPass: string) => {
  return await bcrypt.compare(existPass, enteredPass);
};

const privateKey = Buffer.from(process.env["PRIVATE_KEY"], "base64").toString(
  "ascii"
);

export const generateSignature = (payload: AuthPayload) => {
  return jwt.sign(payload, privateKey, { expiresIn: "1d", algorithm: "RS256" });
};

const publicKey = Buffer.from(process.env["PUBLIC_KEY"], "base64").toString(
  "ascii"
);
export const validateSignature = (req: Request) => {
  const signature = req.get("Authorization");
  if (signature) {
    const payload = jwt.verify(signature.split(" ")[1], publicKey);
    
    return payload as VendorPayload;
  }
  return undefined;
};
