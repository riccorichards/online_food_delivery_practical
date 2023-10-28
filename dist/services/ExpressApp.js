"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const routes_1 = require("../routes");
const path_1 = __importDefault(require("path"));
exports.default = (app) => {
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({ extended: true }));
    app.use("/admin", routes_1.AdminRouter);
    app.use("/vendor", routes_1.VendorRoute);
    app.use("/customer", routes_1.CustomerRouter);
    app.use(routes_1.ShppongRouter);
    app.use("/images", express_1.default.static(path_1.default.join(__dirname, "images")));
    return app;
};
//# sourceMappingURL=ExpressApp.js.map