import express from "express";
import {
  addToCart,
  createOrder,
  createPayment,
  customerLogin,
  customerSignUp,
  customerVerify,
  deleteCart,
  editCustomerProfile,
  getCart,
  getCustomerProfile,
  getOrderById,
  getOrders,
  requestOtp,
  verifyOffer,
} from "../controllers";
import { authenticate } from "../middlewares";

const router = express.Router();

router.post("/signup", customerSignUp);
router.post("/login", customerLogin);
router.use(authenticate);
router.patch("/verify", customerVerify);
router.get("/otp", requestOtp);
router.get("/profile", getCustomerProfile);
router.patch("/profile", editCustomerProfile);

router.post("/create-order", createOrder);
router.get("/orders", getOrders);
router.get("/order/:orderId", getOrderById);

router.post("/cart", addToCart);
router.get("/cart", getCart);
router.delete("/cart", deleteCart);

router.get("/offer/verify/:id", verifyOffer);

router.post("/create-payment", createPayment);
export { router as CustomerRouter };
