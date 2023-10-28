"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const utility_1 = require("../utility");
const authenticate = (req, res, next) => {
    const user = (0, utility_1.validateSignature)(req);
    if (user) {
        req.user = user;
        next();
    }
    else {
        res.status(401).json({ msg: "User is not authorized" });
    }
};
exports.authenticate = authenticate;
//# sourceMappingURL=commonAuth.js.map