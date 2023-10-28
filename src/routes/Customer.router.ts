import express from "express";
import {
  customerLogin,
  customerSignUp,
  customerVerify,
  editCustomerProfile,
  getCustomerProfile,
  requestOtp,
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

export { router as CustomerRouter };
