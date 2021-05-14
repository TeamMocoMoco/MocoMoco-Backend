"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_sens_1 = require("node-sens");
const ncp = new node_sens_1.NCPClient({
    phoneNumber: process.env.PHONENUM,
    serviceId: process.env.SERVICE_KEY,
    secretKey: process.env.SECRET_KEY,
    accessKey: process.env.ACCESS_KEY,
});
exports.default = ncp;
