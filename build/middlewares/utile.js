"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rand = void 0;
function rand(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}
exports.rand = rand;
