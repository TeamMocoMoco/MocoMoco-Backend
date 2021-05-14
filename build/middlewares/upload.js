"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const multer_1 = __importDefault(require("multer"));
const multer_s3_1 = __importDefault(require("multer-s3"));
const path_1 = __importDefault(require("path"));
const s3 = new aws_sdk_1.default.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});
const S3storage = multer_s3_1.default({
    s3,
    bucket: process.env.BUCKET_NAME || "test",
    contentType: multer_s3_1.default.AUTO_CONTENT_TYPE,
    key(req, file, cb) {
        cb(null, `original/${Date.now()}${path_1.default.basename(file.originalname)}`);
    },
});
const serverStorage = multer_1.default.diskStorage({
    destination(req, file, cb) {
        cb(null, "public/");
    },
    filename(req, file, cb) {
        cb(null, `/${Date.now()}${path_1.default.basename(file.originalname)}`);
    },
});
const upload = multer_1.default({
    storage: S3storage,
});
exports.default = upload;
