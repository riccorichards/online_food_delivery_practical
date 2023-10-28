import mongoose, { Schema, Document } from "mongoose";

interface VendorDoc extends Document {
  name: string;
  ownerName: string;
  password: string;
  pincode: string;
  address: string;
  email: string;
  phone: string;
  foodType: [string];
  salt: string;
  serviceAvailable: boolean;
  coverImage: [string];
  rating: number;
  foods: any;
}

const VendorSchema = new Schema(
  {
    name: { type: String, required: true },
    ownerName: { type: String, required: true },
    foodType: { type: [String] },
    pincode: { type: String, required: true },
    address: { type: String },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    salt: { type: String, required: true },
    serviceAvailable: { type: Boolean, required: true },
    rating: { type: String, required: true },
    foods: [{ type: mongoose.SchemaTypes.ObjectId, ref: "food" }],
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
