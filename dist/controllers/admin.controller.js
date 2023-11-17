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
exports.getDeliveryUsers = exports.verifyDeliveryUser = exports.getTxnsById = exports.getTxns = exports.getVendorById = exports.getVendors = exports.createVendor = exports.FindVendor = void 0;
const models_1 = require("../models");
const utility_1 = require("../utility");
const config_1 = require("../config");
const transaction_1 = require("../models/transaction");
const delivery_1 = require("../models/delivery");
const FindVendor = (id, email) => __awaiter(void 0, void 0, void 0, function* () {
    if (email) {
        return yield models_1.Vendor.findOne({ email: email });
    }
    else {
        return yield models_1.Vendor.findById(id);
    }
});
exports.FindVendor = FindVendor;
const createVendor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, ownerName, password, pincode, address, email, phone, foodType, lat, lng, } = req.body;
    const existingVendor = Boolean(yield (0, exports.FindVendor)("", email));
    if (existingVendor)
        return res.status(404).json({ msg: "A vendor is already exist..." });
    const salt = yield (0, utility_1.saltGenerator)(config_1.SALT_NUM);
    const hashedPassword = yield (0, utility_1.passwordGenerator)(password, salt);
    const newVendor = yield models_1.Vendor.create({
        name,
        ownerName,
        password: hashedPassword,
        pincode,
        address,
        email,
        phone,
        status: "Vendor",
        salt: salt,
        foodType: foodType.split(", "),
        serviceAvailable: false,
        coverImage: [],
        rating: 1520,
        foods: [],
        lat,
        lng,
    });
    return res.json(newVendor);
});
exports.createVendor = createVendor;
const getVendors = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const vendors = yield models_1.Vendor.find();
    if (vendors !== null)
        return res.status(200).json(vendors);
    return res.status(404).json({ msg: "vendors data is not available" });
});
exports.getVendors = getVendors;
const getVendorById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const vendor = yield (0, exports.FindVendor)(id);
    if (vendor !== null)
        return res.status(200).json(vendor);
    return res.status(404).json({ msg: "vendor's data not available" });
});
exports.getVendorById = getVendorById;
const getTxns = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const transactions = yield transaction_1.Transaction.find();
    if (transactions.length > 0)
        return res.status(200).json(transactions);
    return res.status(404).json({ msg: "txns not available" });
});
exports.getTxns = getTxns;
const getTxnsById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const txn = yield transaction_1.Transaction.findById(id);
    if (txn !== null)
        return res.status(200).json(txn);
    return res.status(404).json({ msg: "txn not available" });
});
exports.getTxnsById = getTxnsById;
const verifyDeliveryUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id, status } = req.body;
    if (_id) {
        const profile = yield delivery_1.DeliveryUser.findById(_id);
        if (profile) {
            profile.verified = status;
            const savedProfle = yield profile.save();
            return res.status(200).json(savedProfle);
        }
    }
    return res.status(400).json({ msg: "Unable to verify Devlivery user" });
});
exports.verifyDeliveryUser = verifyDeliveryUser;
const getDeliveryUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const deliveryUSer = yield delivery_1.DeliveryUser.find();
    if (deliveryUSer)
        return res.status(200).json(deliveryUSer);
    return res.status(400).json({ msg: "Unable to get Devlivery users" });
});
exports.getDeliveryUsers = getDeliveryUsers;
//# sourceMappingURL=admin.controller.js.map