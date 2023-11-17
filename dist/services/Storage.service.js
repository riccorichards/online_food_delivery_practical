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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPublicUrlForFile = exports.uploadFileToGoogleCloud = void 0;
const storage_1 = require("@google-cloud/storage");
const storage = new storage_1.Storage({
    keyFilename: process.env["GCS_KEY_FILE_NAME"],
});
const bucket = storage.bucket(process.env["GCS_BUCKET_NAME"]);
const uploadFileToGoogleCloud = (file) => {
    if (!file) {
        return;
    }
    const { originalname, mimetype, buffer } = file;
    const blob = bucket.file(originalname);
    const blobStream = blob.createWriteStream({
        metadata: {
            contentType: mimetype,
        },
    });
    blobStream.on("error", (err) => {
        console.log({ err: err });
        return;
    });
    blobStream.end(buffer);
};
exports.uploadFileToGoogleCloud = uploadFileToGoogleCloud;
const getPublicUrlForFile = (fileName) => __awaiter(void 0, void 0, void 0, function* () {
    const options = {
        version: "v4",
        action: "read",
        expires: Date.now() + 1000 * 60 * 24 * 5,
    };
    try {
        const [url] = yield bucket.file(fileName).getSignedUrl(options);
        return url;
    }
    catch (error) {
        console.log({ err: error.message });
    }
});
exports.getPublicUrlForFile = getPublicUrlForFile;
//# sourceMappingURL=Storage.service.js.map