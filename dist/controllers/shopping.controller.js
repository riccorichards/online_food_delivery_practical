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
exports.findAvailableOffers = exports.getRestaurantById = exports.searchFoods = exports.getFoodIn30Min = exports.getTopRestaurant = exports.getFoodAvailability = void 0;
const models_1 = require("../models");
const Offer_1 = require("../models/Offer");
const getFoodAvailability = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const pincode = req.params.pincode;
    const result = yield models_1.Vendor.find({
        pincode: pincode,
        serviceAvailable: false,
    })
        .sort([["rating", "descending"]])
        .populate("foods");
    if (result.length > 0) {
        return res.status(200).json(result);
    }
    return res.status(400).json({ msg: "Data Not Found" });
});
exports.getFoodAvailability = getFoodAvailability;
const getTopRestaurant = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const pincode = req.params.pincode;
    const result = yield models_1.Vendor.find({
        pincode: pincode,
        serviceAvailable: false,
    })
        .sort([["rating", "descending"]])
        .limit(1);
    if (result.length > 0) {
        return res.status(200).json(result);
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
const searchFoods = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const pincode = req.params.pincode;
    const result = yield models_1.Vendor.find({
        pincode: pincode,
        serviceAvailable: false,
    }).populate("foods");
    if (result.length > 0) {
        const foodsResult = result.map((el) => el.foods);
        return res.status(200).json(foodsResult);
    }
    return res.status(400).json({ msg: "Data Not Found" });
});
exports.searchFoods = searchFoods;
const getRestaurantById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield models_1.Vendor.findById(id).populate("foods");
    if (result) {
        return res.status(200).json(result);
    }
    return res.status(400).json({ msg: "Data Not Found" });
});
exports.getRestaurantById = getRestaurantById;
const findAvailableOffers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { pincode } = req.params;
    console.log({ pincode });
    const offers = yield Offer_1.Offer.find({ pincode: pincode, isActive: true });
    if (offers) {
        return res.status(200).json(offers);
    }
    return res.status(400).json({ msg: "Offers Nof Found" });
});
exports.findAvailableOffers = findAvailableOffers;
//# sourceMappingURL=shopping.controller.js.map