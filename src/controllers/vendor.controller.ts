import { Request, Response } from "express";
import {
  CreateOfferInput,
  EditVendorInput,
  VendorLoginInput,
} from "../dto/Vendor.dto";
import { FindVendor } from "./admin.controller";
import { generateSignature, validPassword } from "../utility";
import { CreateFoodInput } from "../dto/Food.dto";
import { Food } from "../models";
import { Order } from "../models/Order";
import { Offer } from "../models/Offer";

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

  const { lat, lng } = req.body;
  if (user) {
    const existingVendo = await FindVendor(user._id);
    if (existingVendo !== null) {
      existingVendo.serviceAvailable = !existingVendo.serviceAvailable;

      if (lat && lng) {
        existingVendo.lat = lat;
        existingVendo.lng = lng;
      }
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

export const getCurrentOrders = async (req: Request, res: Response) => {
  const user = req.user;
  if (user) {
    const orders = await Order.find({ vendorId: user._id }).populate(
      "items.food"
    );

    if (orders != null) {
      return res.status(200).json(orders);
    }
  }
  return res.status(400).json({ msg: "Order not found" });
};
export const getOrdersDetails = async (req: Request, res: Response) => {
  const { orderId } = req.params;
  if (orderId) {
    const order = (await Order.findById(orderId)).populate("items.food");

    if (order != null) {
      return res.status(200).json(order);
    }
  }
  return res.status(400).json({ msg: "Order not found" });
};

export const processOrders = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, remarks, time } = req.body;

  if (id) {
    const order = await Order.findById(id).populate("foods");

    order.orderStatus = status;
    order.remarks = remarks;
    if (time) {
      order.readyTime = time;
    }

    const savedOrder = await order.save();

    if (savedOrder !== null) {
      return res.status(200).json(savedOrder);
    }
  }

  return res.json({ msg: "Unable to process Order!" });
};

export const getOffers = async (req: Request, res: Response) => {
  const user = req.user;
  let currentOffers = Array();

  if (user) {
    const offers = await Offer.find().populate("vendors");

    if (offers) {
      offers.map((item) => {
        if (item.vendors) {
          item.vendors.map((vendor) => {
            if (vendor._id.toString() === user._id) {
              currentOffers.push(item);
            }
          });
        }

        if (item.offerType === "GENERIC") {
          currentOffers.push(item);
        }
      });
    }
    return res.status(200).json(currentOffers);
  }
  return res.status(400).json({ msg: "Offers not available" });
};

export const createOffer = async (req: Request, res: Response) => {
  const user = req.user;
  if (user) {
    const {
      offerType,
      title,
      description,
      minValue,
      offerAmount,
      startValidity,
      endValidity,
      promocode,
      promoType,
      bank,
      bins,
      pincode,
      isActive,
    } = <CreateOfferInput>req.body;

    const vendor = await FindVendor(user._id);
    console.log({ vendor });
    if (vendor) {
      const offer = await Offer.create({
        offerType,
        title,
        description,
        minValue,
        offerAmount,
        startValidity,
        endValidity,
        promocode,
        promoType,
        bank,
        bins,
        pincode,
        isActive,
        vendors: [vendor],
      });

      return res.status(200).json(offer);
    }
  }

  return res.status(400).json({ msg: "Error with adding new offer" });
};
export const updateOffer = async (req: Request, res: Response) => {
  const user = req.user;
  const { id } = req.params;
  if (user) {
    const {
      offerType,
      title,
      description,
      minValue,
      offerAmount,
      startValidity,
      endValidity,
      promocode,
      promoType,
      bank,
      bins,
      pincode,
      isActive,
    } = <CreateOfferInput>req.body;

    const currentOffer = await Offer.findById(id);

    if (currentOffer) {
      const vendor = await FindVendor(user._id);
      if (vendor) {
        (currentOffer.offerType = offerType),
          (currentOffer.title = title),
          (currentOffer.description = description),
          (currentOffer.minValue = minValue),
          (currentOffer.offerAmount = offerAmount),
          (currentOffer.startValidity = startValidity),
          (currentOffer.endValidity = endValidity),
          (currentOffer.promocode = promocode),
          (currentOffer.promoType = promoType),
          (currentOffer.bank = bank),
          (currentOffer.bins = bins),
          (currentOffer.pincode = pincode),
          (currentOffer.isActive = isActive);

        const updatedOffer = await currentOffer.save();
        return res.status(200).json(updatedOffer);
      }
    }
  }

  return res.status(400).json({ msg: "Error with adding new offer" });
};
