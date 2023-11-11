"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeliveryRoute = void 0;
const express_1 = __importDefault(require("express"));
const middlewares_1 = require("../middlewares");
const controllers_1 = require("../controllers");
const router = express_1.default.Router();
exports.DeliveryRoute = router;
/* ------------------- Signup / Create Customer --------------------- */
router.post("/signup", controllers_1.deliverySignUp);
/* ------------------- Login --------------------- */
router.post("/login", controllers_1.deliveryLogin);
/* ------------------- Authentication --------------------- */
router.use(middlewares_1.authenticate);
/* ------------------- Change Service Status --------------------- */
router.put("/change-status", controllers_1.updateDeliveryUserStatus);
/* ------------------- Profile --------------------- */
router.get("/profile", controllers_1.getDeliveryProfile);
router.patch("/profile", controllers_1.editDeliveryProfile);
//# sourceMappingURL=delivery.route.js.map