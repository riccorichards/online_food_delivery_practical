"use strict";
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
        origin: "http://localhost:3000",
        credentials: true,
        methods: ["post", "get", "put", "delete"],
    }));
    app.use("/admin", routes_1.AdminRouter);
    app.use("/vendor", routes_1.VendorRoute);
    app.use("/customer", routes_1.CustomerRouter);
    app.use("/delivery", delivery_route_1.DeliveryRoute);
    app.use(routes_1.ShppongRouter);
    return app;
};
//# sourceMappingURL=ExpressApp.js.map