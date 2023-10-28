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
exports.getFoods = exports.addFood = exports.updateVendorService = exports.updateVendomCoverImage = exports.updateVendorProfile = exports.getVendorProfile = exports.vendorLogin = void 0;
const admin_controller_1 = require("./admin.controller");
const utility_1 = require("../utility");
const models_1 = require("../models");
const vendorLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const existingVendo = yield (0, admin_controller_1.FindVendor)("", email);
    if (existingVendo !== null) {
        const validUser = yield (0, utility_1.validPassword)(existingVendo.password, password);
        if (validUser) {
            const signature = (0, utility_1.generateSignature)({
                _id: existingVendo._id,
                email: existingVendo.email,
                password: existingVendo.password,
                name: existingVendo.name,
                ownerName: existingVendo.ownerName,
            });
            return res.status(200).json(signature);
        }
        else {
            return res.status(403).json({ msg: "Wrong credentials" });
        }
    }
    else {
        return res.status(403).json({ msg: "User not found" });
    }
});
exports.vendorLogin = vendorLogin;
const getVendorProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user) {
        return res.status(200).json(user);
    }
    else {
        return res
            .status(403)
            .json({ msg: "You have not the permission to received this data" });
    }
});
exports.getVendorProfile = getVendorProfile;
const updateVendorProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, ownerName, phone, address } = req.body;
    const user = req.user;
    if (user) {
        const existingVendo = yield (0, admin_controller_1.FindVendor)(user._id);
        if (existingVendo !== null) {
            existingVendo.name = name;
            existingVendo.ownerName = ownerName;
            existingVendo.phone = phone;
            existingVendo.address = address;
            const savedResult = yield existingVendo.save();
            return res.json(savedResult);
        }
        return res.status(200).json(existingVendo);
    }
    else {
        return res
            .status(403)
            .json({ msg: "You have not the permission to received this data" });
    }
});
exports.updateVendorProfile = updateVendorProfile;
const updateVendomCoverImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const { name, desc, cat, foodType, readyTime, price } = (req.body);
    if (user) {
        const vendor = yield (0, admin_controller_1.FindVendor)(user._id);
        if (vendor !== null) {
            const files = req.files;
            const images = files.map((file) => file.filename);
            vendor.foods.push(...images);
            const savedUpdatedVendor = yield vendor.save();
            return res.json(savedUpdatedVendor);
        }
    }
    return res.json({ message: "Unable to Update vendor profile " });
});
exports.updateVendomCoverImage = updateVendomCoverImage;
const updateVendorService = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user) {
        const existingVendo = yield (0, admin_controller_1.FindVendor)(user._id);
        if (existingVendo !== null) {
            existingVendo.serviceAvailable = !existingVendo.serviceAvailable;
            const savedResult = yield existingVendo.save();
            return res.json(savedResult);
        }
        return res.status(200).json(existingVendo);
    }
    else {
        return res
            .status(403)
            .json({ msg: "You have not the permission to received this data" });
    }
});
exports.updateVendorService = updateVendorService;
const addFood = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const { name, desc, cat, foodType, readyTime, price } = (req.body);
    if (user) {
        const vendor = yield (0, admin_controller_1.FindVendor)(user._id);
        if (vendor !== null) {
            const files = req.files;
            const images = files.map((file) => file.filename);
            const food = yield models_1.Food.create({
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
            const savedVendor = yield vendor.save();
            return res.json(savedVendor);
        }
    }
    return res.json({ message: "Unable to Update vendor profile " });
});
exports.addFood = addFood;
const getFoods = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user) {
        const foods = yield models_1.Food.find({ vendorId: user._id });
        if (foods !== null) {
            return res.json(foods);
        }
    }
    return res.json({ message: "Foods not found!" });
});
exports.getFoods = getFoods;
//# sourceMappingURL=vendor.controller.js.map