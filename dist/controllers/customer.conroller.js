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
exports.editCustomerProfile = exports.getCustomerProfile = exports.requestOtp = exports.customerVerify = exports.customerLogin = exports.customerSignUp = void 0;
const class_transformer_1 = require("class-transformer");
const Customer_dto_1 = require("../dto/Customer.dto");
const class_validator_1 = require("class-validator");
const utility_1 = require("../utility");
const customer_1 = require("../models/customer");
const notifications_util_1 = require("../utility/notifications.util");
const customerSignUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const customerInputs = (0, class_transformer_1.plainToClass)(Customer_dto_1.CreateCustomerInputs, req.body);
    const inputErrors = yield (0, class_validator_1.validate)(customerInputs, {
        validationError: { target: true },
    });
    if (inputErrors.length > 0) {
        return res.status(400).json(inputErrors);
    }
    const { password, phone, email } = customerInputs;
    const existingUser = yield customer_1.Customer.findOne({ email: email });
    if (existingUser) {
        return res
            .status(400)
            .json({ err: "User with this email is already exist..." });
    }
    const salt = yield (0, utility_1.saltGenerator)(13);
    const userPaasword = yield (0, utility_1.passwordGenerator)(password, salt);
    const { otp, expiry } = (0, notifications_util_1.generateOtp)();
    const result = yield customer_1.Customer.create({
        email: email,
        password: userPaasword,
        salt: salt,
        phone: phone,
        otp: otp,
        otp_expiry: expiry,
        firstName: "",
        lastName: "",
        address: "",
        verified: false,
        lat: 0,
        lng: 0,
    });
    if (result) {
        yield (0, notifications_util_1.requestOTP)(otp, phone);
        const signature = (0, utility_1.generateSignature)({
            _id: result._id,
            email: result.email,
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
exports.customerSignUp = customerSignUp;
const customerLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const loginInput = (0, class_transformer_1.plainToClass)(Customer_dto_1.UserLoginInput, req.body);
    const loginError = yield (0, class_validator_1.validate)(loginInput, {
        validationError: { target: false },
    });
    if (loginError.length > 0) {
        return res.status(400).json(loginError);
    }
    const { email, password } = loginInput;
    const customer = yield customer_1.Customer.findOne({ email: email });
    if (customer) {
        const validation = yield (0, utility_1.validPassword)(customer.password, password);
        if (validation) {
            const signature = (0, utility_1.generateSignature)({
                _id: customer._id,
                email: customer.email,
                verified: customer.verified,
            });
            return res.status(201).json({
                signature: signature,
                email: customer.email,
                verified: customer.verified,
            });
        }
    }
    return res.status(400).json({ err: "Error with login" });
});
exports.customerLogin = customerLogin;
const customerVerify = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { otp } = req.body;
    const customer = req.user;
    console.log({ otp, customer });
    if (customer) {
        const profile = yield customer_1.Customer.findById(customer._id);
        if (profile) {
            if (profile.otp === parseInt(otp) && profile.otp_expiry >= new Date()) {
                profile.verified = true;
                const updateCustomerResponce = yield profile.save();
                const signature = (0, utility_1.generateSignature)({
                    _id: updateCustomerResponce._id,
                    email: updateCustomerResponce.email,
                    verified: updateCustomerResponce.verified,
                });
                return res.status(201).json({
                    signature: signature,
                    verfied: updateCustomerResponce.verified,
                    email: updateCustomerResponce.email,
                    _id: updateCustomerResponce._id,
                });
            }
        }
    }
    return res.status(400).json({ err: "Error with OTP validation" });
});
exports.customerVerify = customerVerify;
const requestOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const customer = req.user;
    if (customer) {
        const profile = yield customer_1.Customer.findById(customer._id);
        if (profile) {
            const { otp, expiry } = (0, notifications_util_1.generateOtp)();
            profile.otp = otp;
            profile.otp_expiry = expiry;
            yield profile.save();
            yield (0, notifications_util_1.requestOTP)(otp, profile.phone);
            return res
                .status(200)
                .json({ msg: "OTP sent your registered phone number!" });
        }
    }
    return res.status(400).json({ err: "Error with Request OTp" });
});
exports.requestOtp = requestOtp;
const getCustomerProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const customer = req.user;
    if (customer) {
        const profile = yield customer_1.Customer.findById(customer._id);
        if (profile) {
            res.status(200).json(profile);
        }
    }
    return res.status(400).json({ msg: "Error with Request User" });
});
exports.getCustomerProfile = getCustomerProfile;
const editCustomerProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const customer = req.user;
    const profileInput = (0, class_transformer_1.plainToClass)(Customer_dto_1.EditCustomerProfileInput, req.body);
    const profileError = yield (0, class_validator_1.validate)(profileInput, {
        validationError: { target: false },
    });
    if (profileError.length > 0) {
        return res.status(400).json(profileError);
    }
    const { firstname, lastname, address } = profileInput;
    if (customer) {
        const profile = yield customer_1.Customer.findById(customer._id);
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
exports.editCustomerProfile = editCustomerProfile;
//# sourceMappingURL=customer.conroller.js.map