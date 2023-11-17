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
exports.validateSignature = exports.generateSignature = exports.validPassword = exports.passwordGenerator = exports.saltGenerator = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const saltGenerator = (n) => {
    return bcrypt_1.default.genSalt(n);
};
exports.saltGenerator = saltGenerator;
const passwordGenerator = (password, salt) => {
    return bcrypt_1.default.hash(password, salt);
};
exports.passwordGenerator = passwordGenerator;
const validPassword = (enteredPass, existPass) => __awaiter(void 0, void 0, void 0, function* () {
    return yield bcrypt_1.default.compare(existPass, enteredPass);
});
exports.validPassword = validPassword;
const privateKey = Buffer.from(process.env["PRIVATE_KEY"], "base64").toString("ascii");
const generateSignature = (payload) => {
    return jsonwebtoken_1.default.sign(payload, privateKey, { expiresIn: "1d", algorithm: "RS256" });
};
exports.generateSignature = generateSignature;
const publicKey = Buffer.from(process.env["PUBLIC_KEY"], "base64").toString("ascii");
const validateSignature = (req) => {
    const signature = req.get("Authorization");
    if (signature) {
        const payload = jsonwebtoken_1.default.verify(signature.split(" ")[1], publicKey);
        return payload;
    }
    return undefined;
};
exports.validateSignature = validateSignature;
//# sourceMappingURL=password.util.js.map