import { Request, Response } from "express";
import { Food, FoodDoc, Vendor } from "../models";
import { Offer } from "../models/Offer";
import { getPublicUrlForFile } from "../services/Storage.service";
import { FilterFoodType } from "../dto/Food.dto";

const getDigValue = (value: string) => {
  const getDig = value.split(" ")[0];
  const convertToDig = parseInt(getDig);
  return convertToDig;
};

type QueryDurationType = {
  $lte: number;
};

type QueryCuisinesType = {
  $in: string[];
};

interface QueryType {
  vendorId?: string | null;
  foodType?: QueryCuisinesType | null;
  readyTime?: QueryDurationType | null;
}

export const getFilteredFood = async (req: Request, res: Response) => {
  const { vendor, duration, cuisines, reset } =
    req.query as unknown as FilterFoodType;

  if (reset === "true") {
    const foods = await Food.find({}).lean();
    return res.status(200).json(foods);
  }

  let query: QueryType = {};

  if (vendor) {
    const restaurant = await Vendor.findOne({ name: vendor });
    query.vendorId = restaurant._id;
  }

  if (duration) {
    const convertToDig = getDigValue(duration);
    query.readyTime = { $lte: convertToDig };
  }

  if (cuisines) {
    query.foodType = { $in: [cuisines] };
  }

  const foods = await Food.find(query);

  if (foods !== null) {
    console.log({ foods });
    const foodsWithImagesUrl = await Promise.all(
      foods.map(async (food) => {
        const imageUrl = await getPublicUrlForFile(food.images);
        food.images = imageUrl;
        return food;
      })
    );
    return res.status(200).json(foodsWithImagesUrl);
  }
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

      foodResult.push(...vendors.filter((food) => food.readyTime >= 30));
    });

    return res.status(200).json(foodResult);
  }
  return res.status(400).json({ msg: "Data Not Found" });
};

export const getRestaurantById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await Vendor.findById(id).populate("foods").lean();

  if (result) {
    const { foods } = result;
    const foodsWithImage = await Promise.all(
      foods.map(async (food: any) => {
        const imageUrl = await getPublicUrlForFile(food.images);
        food.images = imageUrl;
        return food;
      })
    );

    return res.status(200).json({ ...result, foods: foodsWithImage });
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

export const getAllFoods = async (req: Request, res: Response) => {
  try {
    const foods = await Food.find({}).lean();
    if (!foods) return null;
    const foodsWithImagesUrl = await Promise.all(
      foods.map(async (food) => {
        const imageUrl = await getPublicUrlForFile(food.images);
        food.images = imageUrl;
        return food;
      })
    );
    return res.status(200).json(foodsWithImagesUrl);
  } catch (error: any) {
    console.log(error.message);
    return res.status(400).json({ msg: "Offers Nof Found" });
  }
};
