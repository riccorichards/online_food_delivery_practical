import { Request, Response } from "express";
import { plainToClass } from "class-transformer";
import {
  CartItem,
  CreateCustomerInputs,
  EditCustomerProfileInput,
  OrderInput,
  UserLoginInput,
} from "../dto/Customer.dto";
import { validate } from "class-validator";
import {
  generateSignature,
  passwordGenerator,
  saltGenerator,
  validPassword,
} from "../utility";
import { Customer } from "../models/customer";
import { generateOtp, requestOTP } from "../utility/notifications.util";
import { Food } from "../models";
import { Order } from "../models/Order";
import { Offer } from "../models/Offer";
import { Transaction } from "../models/transaction";
import { FindVendor } from "./admin.controller";
import { DeliveryUser } from "../models/delivery";

export const customerSignUp = async (req: Request, res: Response) => {
  const customerInputs = plainToClass(CreateCustomerInputs, req.body);
  const inputErrors = await validate(customerInputs, {
    validationError: { target: true },
  });

  if (inputErrors.length > 0) {
    return res.status(400).json(inputErrors);
  }
  const { password, phone, email } = customerInputs;

  const existingUser = await Customer.findOne({ email: email });
  if (existingUser) {
    return res
      .status(400)
      .json({ err: "User with this email is already exist..." });
  }
  const salt = await saltGenerator(13);
  const userPaasword = await passwordGenerator(password, salt);

  const { otp, expiry } = generateOtp();

  const result = await Customer.create({
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
    await requestOTP(otp, phone);
    const signature = generateSignature({
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
};

export const customerLogin = async (req: Request, res: Response) => {
  const loginInput = plainToClass(UserLoginInput, req.body);
  const loginError = await validate(loginInput, {
    validationError: { target: false },
  });
  if (loginError.length > 0) {
    return res.status(400).json(loginError);
  }
  const { email, password } = loginInput;

  const customer = await Customer.findOne({ email: email });
  if (customer) {
    const validation = await validPassword(customer.password, password);
    if (validation) {
      const signature = generateSignature({
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
};
export const customerVerify = async (req: Request, res: Response) => {
  const { otp } = req.body;
  const customer = req.user;
  console.log({ otp, customer });
  if (customer) {
    const profile = await Customer.findById(customer._id);
    if (profile) {
      if (profile.otp === parseInt(otp) && profile.otp_expiry >= new Date()) {
        profile.verified = true;
        const updateCustomerResponce = await profile.save();
        const signature = generateSignature({
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
};

export const requestOtp = async (req: Request, res: Response) => {
  const customer = req.user;
  if (customer) {
    const profile = await Customer.findById(customer._id);
    if (profile) {
      const { otp, expiry } = generateOtp();
      profile.otp = otp;
      profile.otp_expiry = expiry;

      await profile.save();
      await requestOTP(otp, profile.phone);

      return res
        .status(200)
        .json({ msg: "OTP sent your registered phone number!" });
    }
  }
  return res.status(400).json({ err: "Error with Request OTp" });
};
export const getCustomerProfile = async (req: Request, res: Response) => {
  const customer = req.user;
  if (customer) {
    const profile = await Customer.findById(customer._id);

    if (profile) {
      res.status(200).json(profile);
    }
  }

  return res.status(400).json({ msg: "Error with Request User" });
};
export const editCustomerProfile = async (req: Request, res: Response) => {
  const customer = req.user;
  const profileInput = plainToClass(EditCustomerProfileInput, req.body);
  const profileError = await validate(profileInput, {
    validationError: { target: false },
  });

  if (profileError.length > 0) {
    return res.status(400).json(profileError);
  }

  const { firstname, lastname, address } = profileInput;
  if (customer) {
    const profile = await Customer.findById(customer._id);

    if (profile) {
      profile.firstName = firstname;
      profile.lastName = lastname;
      profile.address = address;

      const savedProfle = await profile.save();
      return res.status(200).json(savedProfle);
    }
  }

  return res.status(400).json({ msg: "Error with Edit User" });
};

export const createPayment = async (req: Request, res: Response) => {
  const customer = req.user;
  const { amount, paymentMode, offerId } = req.body;
  let payableAmount = Number(amount);
  if (offerId) {
    const appliedOffer = await Offer.findById(offerId);

    if (appliedOffer) {
      if (appliedOffer.isActive) {
        payableAmount = payableAmount - appliedOffer.offerAmount;
      }
    }
  }

  const transaction = await Transaction.create({
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
};

export const assignOrderForDelivery = async (
  orderId: string,
  vendorId: string
) => {
  const vendor = await FindVendor(vendorId);

  if (vendor) {
    const areaCode = vendor.pincode;
    const vendorLat = vendor.lat;
    const vendorLng = vendor.lng;

    const deliveryPerson = await DeliveryUser.find({
      pincode: areaCode,
      verified: true,
      isAvailable: true,
    });

    if (deliveryPerson) {
      const currentOrder = await Order.findById(orderId);

      if (currentOrder) {
        currentOrder.deliveryId = deliveryPerson[0]._id;
        await currentOrder.save();
      }
    }
  }
};

const validateTransaction = async (txnId: string) => {
  const currentTransaction = await Transaction.findById(txnId);
  if (currentTransaction.status.toLowerCase() !== "failed") {
    return { status: true, currentTransaction };
  }

  return { status: false, currentTransaction };
};

export const createOrder = async (req: Request, res: Response) => {
  const customer = req.user;

  const { txnId, amount, items } = <OrderInput>req.body;
  if (customer) {
    const { status, currentTransaction } = await validateTransaction(txnId);

    const orderId = `${Math.floor(Math.random() * 89999) + 1000}`;

    const profile = await Customer.findById(customer._id);

    let netAmount = 0.0;

    let cartItems = Array();

    const foods = await Food.find()
      .where("_id")
      .in(items.map((item) => item._id))
      .exec();

    let vendorId: string;
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
      const currentOrder = await Order.create({
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
      profile.cart = [] as any;
      profile.orders.push(currentOrder);

      currentTransaction.vendorId = vendorId;
      currentTransaction.orderId = orderId;
      currentTransaction.status = "CONFIRMED";

      await currentTransaction.save();

      assignOrderForDelivery(currentOrder._id, vendorId);
      const profileSaveResponse = await profile.save();

      return res.status(200).json(profileSaveResponse);
    }
  }
  return res.status(400).json({ msg: "Error with creating Order" });
};

export const getOrders = async (req: Request, res: Response) => {
  const customer = req.user;

  if (customer) {
    const profile = await (
      await Customer.findById(customer._id)
    ).populate("orders");

    console.log({ profile, customer });

    if (profile) {
      return res.status(200).json(profile.orders);
    }
  }

  return res.status(400).json("Error with fetching orders");
};

export const getOrderById = async (req: Request, res: Response) => {
  const orderId = req.params.orderId;

  if (orderId) {
    const order = await Order.findById(orderId);

    return res.status(200).json(order);
  }

  return res.status(400).json("Error with fetching orders");
};

export const addToCart = async (req: Request, res: Response) => {
  const customer = req.user;

  if (customer) {
    const profile = await Customer.findById(customer._id);

    let cartItem = Array();

    const { _id, unit } = <CartItem>req.body;

    const food = await Food.findById(_id);

    if (food) {
      if (profile != null) {
        cartItem = profile.cart;

        if (cartItem.length > 0) {
          let existingFood = cartItem.filter(
            (el) => el.food._id.toString() === _id
          );
          if (existingFood.length > 0) {
            const index = cartItem.indexOf(existingFood[0]);
            if (unit > 0) {
              cartItem[index] = { food, unit };
            } else {
              cartItem.splice(index, 1);
            }
          } else {
            cartItem.push({ food, unit });
          }
        } else {
          cartItem.push({ food, unit });
        }

        if (cartItem) {
          profile.cart = cartItem as any;
          const cartResult = await profile.save();
          return res.status(200).json(cartResult.cart);
        }
      }
    }
  }
  return res.status(400).json({ msg: "Unable to create Cart!" });
};
export const getCart = async (req: Request, res: Response) => {
  const customer = req.user;

  if (customer) {
    const profile = await Customer.findById(customer._id);
    if (profile) {
      return res.status(200).json(profile.cart);
    }
  }

  return res.status(400).json({ msg: "Cart is Empty" });
};
export const deleteCart = async (req: Request, res: Response) => {
  const customer = req.user;

  if (customer) {
    const profile = await Customer.findById(customer._id);
    if (profile != null) {
      profile.cart = [] as any;
      const savedCart = await profile.save();
      return res.status(200).json(savedCart);
    }
  }

  return res.status(400).json({ msg: "Cart is Empty" });
};

export const verifyOffer = async (req: Request, res: Response) => {
  const { id } = req.params;

  const customer = req.user;

  if (customer) {
    const appliedOffer = await Offer.findById(id);

    if (appliedOffer) {
      if (appliedOffer.promoType === "USER") {
        // only can apply per user
      } else {
        if (appliedOffer.isActive) {
          return res
            .status(200)
            .json({ msg: "Offer is valid", offer: appliedOffer });
        }
      }
    }
  }
  return res.status(400).json({ msg: "Offer is not valid" });
};
