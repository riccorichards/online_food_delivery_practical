import { Request, Response } from "express";
import { FoodDoc, Vendor } from "../models";
import { Offer } from "../models/Offer";

export const getFoodAvailability = async (req: Request, res: Response) => {
  const pincode = req.params.pincode;
  const result = await Vendor.find({
    pincode: pincode,
    serviceAvailable: false,
  })
    .sort([["rating", "descending"]])
    .populate("foods");

  if (result.length > 0) {
    return res.status(200).json(result);
  }

  return res.status(400).json({ msg: "Data Not Found" });
};

export const getTopRestaurant = async (req: Request, res: Response) => {
  const result = await Vendor.find({
    serviceAvailable: false,
  })
    .sort([["rating", "descending"]])
    .limit(5);

  if (result.length > 0) {
    const vendorsBasedOnRating = result.map((vendor) => {
      return {
        name: vendor.name,
        rating: vendor.rating,
        _id: vendor._id,
      };
    });

    return res.status(200).json(vendorsBasedOnRating);
  }

  return res.status(400).json({ msg: "Data Not Found" });
};

export const getFoodIn30Min = async (req: Request, res: Response) => {
  const pincode = req.params.pincode;
  const result = await Vendor.find({
    pincode: pincode,
    serviceAvailable: false,
  }).populate("foods");

  if (result.length > 0) {
    let foodResult: any = [];

    result.map((vendor) => {
      const vendors = vendor.foods as [FoodDoc];

      foodResult.push(
        ...vendors.filter((food) => parseFloat(food.readyTime) >= 30)
      );
    });

    return res.status(200).json(foodResult);
  }
  return res.status(400).json({ msg: "Data Not Found" });
};
export const searchFoods = async (req: Request, res: Response) => {
  const pincode = req.params.pincode;
  const result = await Vendor.find({
    pincode: pincode,
    serviceAvailable: false,
  }).populate("foods");
  if (result.length > 0) {
    const foodsResult = result.map((el) => el.foods) as any;
    return res.status(200).json(foodsResult);
  }
  return res.status(400).json({ msg: "Data Not Found" });
};
export const getRestaurantById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await Vendor.findById(id).populate("foods");

  if (result) {
    return res.status(200).json(result);
  }
  return res.status(400).json({ msg: "Data Not Found" });
};

export const findAvailableOffers = async (req: Request, res: Response) => {
  const { pincode } = req.params;
  const offers = await Offer.find({ pincode: pincode, isActive: true });
  if (offers) {
    return res.status(200).json(offers);
  }

  return res.status(400).json({ msg: "Offers Nof Found" });
};
