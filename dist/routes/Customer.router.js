"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerRouter = void 0;
const express_1 = __importDefault(require("express"));
const controllers_1 = require("../controllers");
const middlewares_1 = require("../middlewares");
const router = express_1.default.Router();
exports.CustomerRouter = router;
router.post("/signup", controllers_1.customerSignUp);
router.post("/login", controllers_1.customerLogin);
router.use(middlewares_1.authenticate);
router.patch("/verify", controllers_1.customerVerify);
router.get("/otp", controllers_1.requestOtp);
router.get("/profile", controllers_1.getCustomerProfile);
router.patch("/profile", controllers_1.editCustomerProfile);
router.post("/create-order", controllers_1.createOrder);
router.get("/orders", controllers_1.getOrders);
router.get("/order/:orderId", controllers_1.getOrderById);
router.post("/cart", controllers_1.addToCart);
router.get("/cart", controllers_1.getCart);
router.delete("/cart", controllers_1.deleteCart);
router.delete("/cart/:foodId", controllers_1.deleteFoodFromCart);
router.get("/offer/verify/:id", controllers_1.verifyOffer);
router.post("/create-payment", controllers_1.createPayment);
//# sourceMappingURL=Customer.router.js.map