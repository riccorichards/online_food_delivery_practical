"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllFoods = exports.findAvailableOffers = exports.getRestaurantById = exports.getFoodIn30Min = exports.getTopRestaurant = exports.getFilteredFood = void 0;
const models_1 = require("../models");
const Offer_1 = require("../models/Offer");
const Storage_service_1 = require("../services/Storage.service");
const getDigValue = (value) => {
    const getDig = value.split(" ")[0];
    const convertToDig = parseInt(getDig);
    return convertToDig;
};
const getFilteredFood = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { vendor, duration, cuisines, reset } = req.query;
    if (reset === "true") {
        const foods = yield models_1.Food.find({}).lean();
        return res.status(200).json(foods);
    }
    let query = {};
    if (vendor) {
        const restaurant = yield models_1.Vendor.findOne({ name: vendor });
        query.vendorId = restaurant._id;
    }
    if (duration) {
        const convertToDig = getDigValue(duration);
        query.readyTime = { $lte: convertToDig };
    }
    if (cuisines) {
        query.foodType = { $in: [cuisines] };
    }
    const foods = yield models_1.Food.find(query);
    if (foods !== null) {
        console.log({ foods });
        const foodsWithImagesUrl = yield Promise.all(foods.map((food) => __awaiter(void 0, void 0, void 0, function* () {
            const imageUrl = yield (0, Storage_service_1.getPublicUrlForFile)(food.images);
            food.images = imageUrl;
            return food;
        })));
        return res.status(200).json(foodsWithImagesUrl);
    }
});
exports.getFilteredFood = getFilteredFood;
const getTopRestaurant = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield models_1.Vendor.find({
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
});
exports.getTopRestaurant = getTopRestaurant;
const getFoodIn30Min = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const pincode = req.params.pincode;
    const result = yield models_1.Vendor.find({
        pincode: pincode,
        serviceAvailable: false,
    }).populate("foods");
    if (result.length > 0) {
        let foodResult = [];
        result.map((vendor) => {
            const vendors = vendor.foods;
            foodResult.push(...vendors.filter((food) => food.readyTime >= 30));
        });
        return res.status(200).json(foodResult);
    }
    return res.status(400).json({ msg: "Data Not Found" });
});
exports.getFoodIn30Min = getFoodIn30Min;
const getRestaurantById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield models_1.Vendor.findById(id).populate("foods").lean();
    if (result) {
        const { foods } = result;
        const foodsWithImage = yield Promise.all(foods.map((food) => __awaiter(void 0, void 0, void 0, function* () {
            const imageUrl = yield (0, Storage_service_1.getPublicUrlForFile)(food.images);
            food.images = imageUrl;
            return food;
        })));
        return res.status(200).json(Object.assign(Object.assign({}, result), { foods: foodsWithImage }));
    }
    return res.status(400).json({ msg: "Data Not Found" });
});
exports.getRestaurantById = getRestaurantById;
const findAvailableOffers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { pincode } = req.params;
    const offers = yield Offer_1.Offer.find({ pincode: pincode, isActive: true });
    if (offers) {
        return res.status(200).json(offers);
    }
    return res.status(400).json({ msg: "Offers Nof Found" });
});
exports.findAvailableOffers = findAvailableOffers;
const getAllFoods = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const foods = yield models_1.Food.find({}).lean();
        if (!foods)
            return null;
        const foodsWithImagesUrl = yield Promise.all(foods.map((food) => __awaiter(void 0, void 0, void 0, function* () {
            const imageUrl = yield (0, Storage_service_1.getPublicUrlForFile)(food.images);
            food.images = imageUrl;
            return food;
        })));
        return res.status(200).json(foodsWithImagesUrl);
    }
    catch (error) {
        console.log(error.message);
        return res.status(400).json({ msg: "Offers Nof Found" });
    }
});
exports.getAllFoods = getAllFoods;
//# sourceMappingURL=shopping.controller.js.map