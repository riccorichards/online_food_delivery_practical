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
exports.updateDeliveryUserStatus = exports.editDeliveryProfile = exports.getDeliveryProfile = exports.deliveryLogin = exports.deliverySignUp = void 0;
const class_transformer_1 = require("class-transformer");
const Customer_dto_1 = require("../dto/Customer.dto");
const class_validator_1 = require("class-validator");
const utility_1 = require("../utility");
const delivery_1 = require("../models/delivery");
const deliverySignUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const deliveryUser = (0, class_transformer_1.plainToClass)(Customer_dto_1.CreateDeiveryUserInputs, req.body);
    const inputErrors = yield (0, class_validator_1.validate)(deliveryUser, {
        validationError: { target: true },
    });
    if (inputErrors.length > 0) {
        return res.status(400).json(inputErrors);
    }
    const { password, phone, email, firstname, lastname, address, pincode } = deliveryUser;
    const existingDeliveryUser = yield delivery_1.DeliveryUser.findOne({ email: email });
    if (existingDeliveryUser) {
        return res
            .status(400)
            .json({ err: "A delivery User with this email is already exist..." });
    }
    const salt = yield (0, utility_1.saltGenerator)(13);
    const userPaasword = yield (0, utility_1.passwordGenerator)(password, salt);
    const result = yield delivery_1.DeliveryUser.create({
        email: email,
        password: userPaasword,
        salt: salt,
        phone: phone,
        firstName: firstname,
        lastName: lastname,
        pincode: pincode,
        address: address,
        verified: false,
        lat: 0,
        lng: 0,
        orders: [],
        isAvailable: false,
    });
    if (result) {
        const signature = (0, utility_1.generateSignature)({
            _id: result._id,
            verified: result.verified,
        });
        return res.status(201).json({
            signature: signature,
            verfied: result.verified,
            email: result.email,
            _id: result._id,
        });
    }
    return res.status(400).json({ err: "Error with Sign up" });
});
exports.deliverySignUp = deliverySignUp;
const deliveryLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const loginInput = (0, class_transformer_1.plainToClass)(Customer_dto_1.UserLoginInput, req.body);
    const loginError = yield (0, class_validator_1.validate)(loginInput, {
        validationError: { target: false },
    });
    if (loginError.length > 0) {
        return res.status(400).json(loginError);
    }
    const { email, password } = loginInput;
    const deliveryUser = yield delivery_1.DeliveryUser.findOne({ email: email });
    if (deliveryUser) {
        const validation = yield (0, utility_1.validPassword)(deliveryUser.password, password);
        if (validation) {
            const signature = (0, utility_1.generateSignature)({
                _id: deliveryUser._id,
                verified: deliveryUser.verified,
            });
            return res.status(201).json({
                signature: signature,
                email: deliveryUser.email,
                verified: deliveryUser.verified,
            });
        }
    }
    return res.status(400).json({ err: "Error with login" });
});
exports.deliveryLogin = deliveryLogin;
const getDeliveryProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const deliveryUser = req.user;
    if (deliveryUser) {
        const profile = yield delivery_1.DeliveryUser.findById(deliveryUser._id);
        if (profile) {
            return res.status(200).json(profile);
        }
    }
    return res.status(400).json({ msg: "Error with Request User" });
});
exports.getDeliveryProfile = getDeliveryProfile;
const editDeliveryProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const deliveryUser = req.user;
    const profileInput = (0, class_transformer_1.plainToClass)(Customer_dto_1.EditCustomerProfileInput, req.body);
    const profileError = yield (0, class_validator_1.validate)(profileInput, {
        validationError: { target: false },
    });
    if (profileError.length > 0) {
        return res.status(400).json(profileError);
    }
    const { firstname, lastname, address } = profileInput;
    if (deliveryUser) {
        const profile = yield delivery_1.DeliveryUser.findById(deliveryUser._id);
        if (profile) {
            profile.firstName = firstname;
            profile.lastName = lastname;
            profile.address = address;
            const savedProfle = yield profile.save();
            return res.status(200).json(savedProfle);
        }
    }
    return res.status(400).json({ msg: "Error with Edit User" });
});
exports.editDeliveryProfile = editDeliveryProfile;
const updateDeliveryUserStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const deliveryUser = req.user;
    if (deliveryUser) {
        const { lat, lng } = req.body;
        const profile = yield delivery_1.DeliveryUser.findById(deliveryUser._id);
        if (profile) {
            if (lat && lng) {
                profile.lat = lat;
                profile.lng = lng;
            }
            profile.isAvailable = !profile.isAvailable;
            const savedProfle = yield profile.save();
            return res.status(200).json(savedProfle);
        }
    }
    return res.status(400).json({ msg: "Offer is not valid" });
});
exports.updateDeliveryUserStatus = updateDeliveryUserStatus;
//# sourceMappingURL=delivery.controller.js.map