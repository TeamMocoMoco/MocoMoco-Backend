"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const SMS_1 = require("../../models/SMS");
const validation_1 = require("../../middlewares/validation");
const SMSService_1 = __importDefault(require("./SMSService"));
class SMSController {
    constructor() {
        this.path = "/SMS";
        this.router = express_1.default.Router();
        this.dto = SMS_1.SMSDTO;
        // 인증번호 전송
        this.sendSMS = async (req, res, next) => {
            const phoneData = req.body;
            try {
                await this.smsService.sendSMS(phoneData);
                res.send({ result: "success" });
            }
            catch (err) {
                console.log(err);
                next(err);
            }
        };
        // 인증번호 확인
        this.checkSMS = async (req, res, next) => {
            const checkData = req.body;
            try {
                const checkResult = await this.smsService.checkSMS(checkData);
                const token = await this.smsService.createToken(checkResult[1]);
                if (checkResult[0]) {
                    return res.send({ result: { phone: { token } } });
                }
                else {
                    return res.send({
                        result: { user: { _id: checkResult[1], token: token } },
                    });
                }
            }
            catch (err) {
                console.log(err);
                next(err);
            }
        };
        this.initializeRoutes();
        this.smsService = new SMSService_1.default();
    }
    initializeRoutes() {
        this.router.post(`${this.path}/send`, validation_1.validation(this.dto, true), this.sendSMS);
        this.router.post(`${this.path}/check`, validation_1.validation(this.dto, true), this.checkSMS);
    }
}
exports.default = SMSController;
