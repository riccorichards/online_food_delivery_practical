import mongoose, { Schema, Document } from "mongoose";

export interface VendorDoc extends Document {
  name: string;
  ownerName: string;
  password: string;
  pincode: string;
  address: string;
  status: string;
  email: string;
  phone: string;
  foodType: [string];
  salt: string;
  serviceAvailable: boolean;
  coverImage: [string];
  rating: number;
  foods: any;
  lat: number;
  lng: number;
}

const VendorSchema = new Schema(
  {
    name: { type: String, required: true },
    ownerName: { type: String, required: true },
    foodType: { type: [String] },
    pincode: { type: String, required: true },
    address: { type: String },
    status: { type: String },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    salt: { type: String, required: true },
    serviceAvailable: { type: Boolean, required: true },
    rating: { type: String, required: true },
    foods: [{ type: mongoose.SchemaTypes.ObjectId, ref: "food" }],
    lat: { type: Number },
    lng: { type: Number },
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
        delete ret.salt;
        delete ret.__v;
        delete ret.createdAt;
        delete ret.updatedAt;
      },
    },
    timestamps: true,
  }
);

const Vendor = mongoose.model<VendorDoc>("Vendor", VendorSchema);

export { Vendor };
