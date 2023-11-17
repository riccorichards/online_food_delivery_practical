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
const ExpressApp_1 = __importDefault(require("./services/ExpressApp"));
const express_1 = __importDefault(require("express"));
const Database_1 = __importDefault(require("./services/Database"));
const config_1 = require("./config");
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    const app = (0, express_1.default)();
    (0, ExpressApp_1.default)(app);
    (0, Database_1.default)();
    //app.use((error, req, res, next) => {
    //  if (error instanceof multer.MulterError) {
    //    if (error.code === "LIMIT_FILE_SIZE") {
    //      return res.status(400).json({
    //        message: "file is too large",
    //      });
    //    }
    //    if (error.code === "LIMIT_FILE_COUNT") {
    //      return res.status(400).json({
    //        message: "File limit reached",
    //      });
    //    }
    //    if (error.code === "LIMIT_UNEXPECTED_FILE") {
    //      return res.status(400).json({
    //        message: "File must be an image",
    //      });
    //    }
    //  }
    //});
    app.listen(config_1.PORT, () => {
        console.log(`We are running at ${config_1.PORT}`);
    });
});
startServer();
//# sourceMappingURL=index.js.map