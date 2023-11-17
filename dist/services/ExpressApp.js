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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const routes_1 = require("../routes");
const delivery_route_1 = require("../routes/delivery.route");
const cors_1 = __importDefault(require("cors"));
exports.default = (app) => {
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({ extended: true }));
    app.use((0, cors_1.default)({
        origin: "https://demo-online-food-delivery-client.vercel.app",
        credentials: true,
        methods: ["post", "get", "put", "delete"],
    }));
    app.get("/check-healthy", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        return res.status(200).json("Hello");
    }));
    app.use("/admin", routes_1.AdminRouter);
    app.use("/vendor", routes_1.VendorRoute);
    app.use("/customer", routes_1.CustomerRouter);
    app.use("/delivery", delivery_route_1.DeliveryRoute);
    app.use(routes_1.ShppongRouter);
    return app;
};
//# sourceMappingURL=ExpressApp.js.map