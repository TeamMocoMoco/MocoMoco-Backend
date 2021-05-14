"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtPhoneValidation = exports.JwtValidation = exports.validation = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const model_1 = __importDefault(require("../models/SMS/model"));
const model_2 = __importDefault(require("../models/User/model"));
function validation(type, skipMissingProperties = false) {
    return async (req, res, next) => {
        const errors = await class_validator_1.validate(class_transformer_1.plainToClass(type, req.body), {
            skipMissingProperties,
        });
        if (errors.length > 0) {
            const message = errors
                .map((error) => {
                return error.constraints && Object.values(error.constraints);
            })
                .join(", ");
            next(new Error(message));
        }
        else {
            next();
        }
    };
}
exports.validation = validation;
const JwtValidation = async (req, res, next) => {
    const { token } = req.headers;
    if (!token || typeof token === "object") {
        next(new Error("로그인 후 이용 가능한 기능입니다."));
        return;
    }
    try {
        const { userId } = jsonwebtoken_1.default.verify(token, process.env.TOKEN_KEY || "token");
        const user = await model_2.default.findById(userId);
        if (!user) {
            next(new Error("사용자가 없습니다."));
        }
        res.locals.user = user && user._id.toString();
        next();
    }
    catch (err) {
        next(new Error("로그인 후 이용 가능한 기능입니다."));
    }
};
exports.JwtValidation = JwtValidation;
const JwtPhoneValidation = async (req, res, next) => {
    const { phonetoken } = req.headers;
    if (!phonetoken || typeof phonetoken === "object") {
        next(new Error("로그인 후 이용 가능한 기능입니다."));
        return;
    }
    try {
        const { phone } = jsonwebtoken_1.default.verify(phonetoken, process.env.TOKEN_KEY || "token");
        const sms = await model_1.default.findOne({ phone: phone }).sort("-updatedAt");
        if (!sms) {
            next(new Error("사용자가 없습니다."));
        }
        else {
            res.locals.phone = sms.phone;
            next();
        }
    }
    catch (err) {
        next(new Error("로그인 후 이용 가능한 기능입니다."));
    }
};
exports.JwtPhoneValidation = JwtPhoneValidation;
