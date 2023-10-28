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
exports.requestOTP = exports.generateOtp = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const generateOtp = () => {
    const otp = Math.floor(Math.random() * 900000 + 100000);
    const expiry = new Date();
    expiry.setTime(new Date().getTime() + 30 * 60 * 1000);
    return { otp, expiry };
};
exports.generateOtp = generateOtp;
const requestOTP = (otp, toPhoneNumber) => __awaiter(void 0, void 0, void 0, function* () {
    const accountSid = process.env["TWILIO_ACCESS_SID"];
    const authToken = process.env["TWILIO_AUTH_TOKEN"];
    const client = require("twilio")(accountSid, authToken);
    const response = yield client.messages.create({
        body: `Your OTP is ${otp}`,
        from: "+12513330910",
        to: `+995${toPhoneNumber}`,
    });
    return response;
});
exports.requestOTP = requestOTP;
//# sourceMappingURL=notifications.util.js.map