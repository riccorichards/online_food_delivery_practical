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
exports.updateOffer = exports.createOffer = exports.getOffers = exports.processOrders = exports.getOrdersDetails = exports.getCurrentOrders = exports.getFoods = exports.addFood = exports.updateVendorService = exports.updateVendomCoverImage = exports.updateVendorProfile = exports.getVendorProfile = exports.vendorLogin = void 0;
const admin_controller_1 = require("./admin.controller");
const utility_1 = require("../utility");
const models_1 = require("../models");
const Order_1 = require("../models/Order");
const Offer_1 = require("../models/Offer");
const uuid_1 = require("uuid");
const Storage_service_1 = require("../services/Storage.service");
const vendorLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const existingVendo = yield (0, admin_controller_1.FindVendor)("", email);
    if (existingVendo !== null) {
        const validUser = yield (0, utility_1.validPassword)(existingVendo.password, password);
        if (validUser) {
            const signature = (0, utility_1.generateSignature)({
                _id: existingVendo._id,
                status: existingVendo.status,
            });
            return res
                .status(200)
                .json({ signature: signature, status: existingVendo.status });
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
    const { lat, lng } = req.body;
    if (user) {
        const existingVendo = yield (0, admin_controller_1.FindVendor)(user._id);
        if (existingVendo !== null) {
            existingVendo.serviceAvailable = !existingVendo.serviceAvailable;
            if (lat && lng) {
                existingVendo.lat = lat;
                existingVendo.lng = lng;
            }
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
    const { name, desc, foodType, readyTime, price } = req.body;
    if (user) {
        try {
            const file = req.file;
            const { originalname, buffer, mimetype } = file;
            const imageUniqueName = `${(0, uuid_1.v4)()}-${originalname}`;
            (0, Storage_service_1.uploadFileToGoogleCloud)({
                buffer,
                mimetype,
                originalname: imageUniqueName,
            });
            const vendor = yield (0, admin_controller_1.FindVendor)(user._id);
            if (vendor !== null) {
                const food = yield models_1.Food.create({
                    vendorId: vendor._id,
                    name: name,
                    description: desc,
                    price: price,
                    rating: 0,
                    readyTime: readyTime,
                    foodType: foodType.split(", "),
                    images: imageUniqueName,
                });
                vendor.foods.push(food);
                const savedVendor = yield vendor.save();
                return res.json(savedVendor);
            }
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Error in adding food" });
        }
    }
    return res.json({ message: "Unable to Update vendor profile" });
});
exports.addFood = addFood;
const getFoods = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user) {
        const foods = yield models_1.Food.find({ vendorId: user._id });
        if (foods !== null) {
            const foodsWithImagesUrl = yield Promise.all(foods.map((food) => __awaiter(void 0, void 0, void 0, function* () {
                const imageUrl = yield (0, Storage_service_1.getPublicUrlForFile)(food.images);
                food.images = imageUrl;
                return food;
            })));
            return res.json(foodsWithImagesUrl);
        }
    }
    return res.json({ message: "Foods not found!" });
});
exports.getFoods = getFoods;
const getCurrentOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user) {
        const orders = yield Order_1.Order.find({ vendorId: user._id }).populate("items.food");
        if (orders != null) {
            return res.status(200).json(orders);
        }
    }
    return res.status(400).json({ msg: "Order not found" });
});
exports.getCurrentOrders = getCurrentOrders;
const getOrdersDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { orderId } = req.params;
    if (orderId) {
        const order = (yield Order_1.Order.findById(orderId)).populate("items.food");
        if (order != null) {
            return res.status(200).json(order);
        }
    }
    return res.status(400).json({ msg: "Order not found" });
});
exports.getOrdersDetails = getOrdersDetails;
const processOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { status, remarks, time } = req.body;
    if (id) {
        const order = yield Order_1.Order.findById(id).populate("foods");
        order.orderStatus = status;
        order.remarks = remarks;
        if (time) {
            order.readyTime = time;
        }
        const savedOrder = yield order.save();
        if (savedOrder !== null) {
            return res.status(200).json(savedOrder);
        }
    }
    return res.json({ msg: "Unable to process Order!" });
});
exports.processOrders = processOrders;
const getOffers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    let currentOffers = Array();
    if (user) {
        const offers = yield Offer_1.Offer.find().populate("vendors");
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
});
exports.getOffers = getOffers;
const createOffer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user) {
        const { offerType, title, description, minValue, offerAmount, startValidity, endValidity, promocode, promoType, bank, bins, pincode, isActive, } = req.body;
        const vendor = yield (0, admin_controller_1.FindVendor)(user._id);
        if (vendor) {
            const offer = yield Offer_1.Offer.create({
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
});
exports.createOffer = createOffer;
const updateOffer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const { id } = req.params;
    if (user) {
        const { offerType, title, description, minValue, offerAmount, startValidity, endValidity, promocode, promoType, bank, bins, pincode, isActive, } = req.body;
        const currentOffer = yield Offer_1.Offer.findById(id);
        if (currentOffer) {
            const vendor = yield (0, admin_controller_1.FindVendor)(user._id);
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
                const updatedOffer = yield currentOffer.save();
                return res.status(200).json(updatedOffer);
            }
        }
    }
    return res.status(400).json({ msg: "Error with adding new offer" });
});
exports.updateOffer = updateOffer;
//# sourceMappingURL=vendor.controller.js.map