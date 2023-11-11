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
exports.verifyOffer = exports.deleteCart = exports.getCart = exports.addToCart = exports.getOrderById = exports.getOrders = exports.createOrder = exports.assignOrderForDelivery = exports.createPayment = exports.editCustomerProfile = exports.getCustomerProfile = exports.requestOtp = exports.customerVerify = exports.customerLogin = exports.customerSignUp = void 0;
const class_transformer_1 = require("class-transformer");
const Customer_dto_1 = require("../dto/Customer.dto");
const class_validator_1 = require("class-validator");
const utility_1 = require("../utility");
const customer_1 = require("../models/customer");
const notifications_util_1 = require("../utility/notifications.util");
const models_1 = require("../models");
const Order_1 = require("../models/Order");
const Offer_1 = require("../models/Offer");
const transaction_1 = require("../models/transaction");
const admin_controller_1 = require("./admin.controller");
const delivery_1 = require("../models/delivery");
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
        orders: [],
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
const createPayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const customer = req.user;
    const { amount, paymentMode, offerId } = req.body;
    let payableAmount = Number(amount);
    if (offerId) {
        const appliedOffer = yield Offer_1.Offer.findById(offerId);
        if (appliedOffer) {
            if (appliedOffer.isActive) {
                payableAmount = payableAmount - appliedOffer.offerAmount;
            }
        }
    }
    const transaction = yield transaction_1.Transaction.create({
        customer: customer._id,
        vendorId: "",
        orderId: "",
        orderValue: payableAmount,
        offerUsed: offerId || "NA",
        status: "OPEN",
        paymentMode: paymentMode,
        paymentResponse: "Payment is Cash on Delivery",
    });
    return res.status(200).json(transaction);
});
exports.createPayment = createPayment;
const assignOrderForDelivery = (orderId, vendorId) => __awaiter(void 0, void 0, void 0, function* () {
    const vendor = yield (0, admin_controller_1.FindVendor)(vendorId);
    if (vendor) {
        const areaCode = vendor.pincode;
        const vendorLat = vendor.lat;
        const vendorLng = vendor.lng;
        const deliveryPerson = yield delivery_1.DeliveryUser.find({
            pincode: areaCode,
            verified: true,
            isAvailable: true,
        });
        if (deliveryPerson) {
            const currentOrder = yield Order_1.Order.findById(orderId);
            if (currentOrder) {
                currentOrder.deliveryId = deliveryPerson[0]._id;
                yield currentOrder.save();
            }
        }
    }
});
exports.assignOrderForDelivery = assignOrderForDelivery;
const validateTransaction = (txnId) => __awaiter(void 0, void 0, void 0, function* () {
    const currentTransaction = yield transaction_1.Transaction.findById(txnId);
    if (currentTransaction.status.toLowerCase() !== "failed") {
        return { status: true, currentTransaction };
    }
    return { status: false, currentTransaction };
});
const createOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const customer = req.user;
    const { txnId, amount, items } = req.body;
    if (customer) {
        const { status, currentTransaction } = yield validateTransaction(txnId);
        const orderId = `${Math.floor(Math.random() * 89999) + 1000}`;
        const profile = yield customer_1.Customer.findById(customer._id);
        let netAmount = 0.0;
        let cartItems = Array();
        const foods = yield models_1.Food.find()
            .where("_id")
            .in(items.map((item) => item._id))
            .exec();
        let vendorId;
        foods.map((food) => {
            items.map(({ _id, unit }) => {
                if (food._id == _id) {
                    vendorId = food.vendorId;
                    netAmount += food.price * unit;
                    cartItems.push({ food, unit });
                }
            });
        });
        if (cartItems) {
            const currentOrder = yield Order_1.Order.create({
                orderId: orderId,
                vendorId: vendorId,
                items: cartItems,
                totalAmount: netAmount,
                paidAmount: amount,
                orderDate: new Date(),
                orderStatus: "Waiting",
                remarks: "",
                deliveryId: "",
                readyTime: 15,
            });
            profile.cart = [];
            profile.orders.push(currentOrder);
            currentTransaction.vendorId = vendorId;
            currentTransaction.orderId = orderId;
            currentTransaction.status = "CONFIRMED";
            yield currentTransaction.save();
            (0, exports.assignOrderForDelivery)(currentOrder._id, vendorId);
            const profileSaveResponse = yield profile.save();
            return res.status(200).json(profileSaveResponse);
        }
    }
    return res.status(400).json({ msg: "Error with creating Order" });
});
exports.createOrder = createOrder;
const getOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const customer = req.user;
    if (customer) {
        const profile = yield (yield customer_1.Customer.findById(customer._id)).populate("orders");
        console.log({ profile, customer });
        if (profile) {
            return res.status(200).json(profile.orders);
        }
    }
    return res.status(400).json("Error with fetching orders");
});
exports.getOrders = getOrders;
const getOrderById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const orderId = req.params.orderId;
    if (orderId) {
        const order = yield Order_1.Order.findById(orderId);
        return res.status(200).json(order);
    }
    return res.status(400).json("Error with fetching orders");
});
exports.getOrderById = getOrderById;
const addToCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const customer = req.user;
    if (customer) {
        const profile = yield customer_1.Customer.findById(customer._id);
        let cartItem = Array();
        const { _id, unit } = req.body;
        const food = yield models_1.Food.findById(_id);
        if (food) {
            if (profile != null) {
                cartItem = profile.cart;
                if (cartItem.length > 0) {
                    let existingFood = cartItem.filter((el) => el.food._id.toString() === _id);
                    if (existingFood.length > 0) {
                        const index = cartItem.indexOf(existingFood[0]);
                        if (unit > 0) {
                            cartItem[index] = { food, unit };
                        }
                        else {
                            cartItem.splice(index, 1);
                        }
                    }
                    else {
                        cartItem.push({ food, unit });
                    }
                }
                else {
                    cartItem.push({ food, unit });
                }
                if (cartItem) {
                    profile.cart = cartItem;
                    const cartResult = yield profile.save();
                    return res.status(200).json(cartResult.cart);
                }
            }
        }
    }
    return res.status(400).json({ msg: "Unable to create Cart!" });
});
exports.addToCart = addToCart;
const getCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const customer = req.user;
    if (customer) {
        const profile = yield customer_1.Customer.findById(customer._id);
        if (profile) {
            return res.status(200).json(profile.cart);
        }
    }
    return res.status(400).json({ msg: "Cart is Empty" });
});
exports.getCart = getCart;
const deleteCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const customer = req.user;
    if (customer) {
        const profile = yield customer_1.Customer.findById(customer._id);
        if (profile != null) {
            profile.cart = [];
            const savedCart = yield profile.save();
            return res.status(200).json(savedCart);
        }
    }
    return res.status(400).json({ msg: "Cart is Empty" });
});
exports.deleteCart = deleteCart;
const verifyOffer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const customer = req.user;
    if (customer) {
        const appliedOffer = yield Offer_1.Offer.findById(id);
        if (appliedOffer) {
            if (appliedOffer.promoType === "USER") {
                // only can apply per user
            }
            else {
                if (appliedOffer.isActive) {
                    return res
                        .status(200)
                        .json({ msg: "Offer is valid", offer: appliedOffer });
                }
            }
        }
    }
    return res.status(400).json({ msg: "Offer is not valid" });
});
exports.verifyOffer = verifyOffer;
//# sourceMappingURL=customer.conroller.js.map