"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dropAllCollections = exports.removeAllCollections = void 0;
// test-setup.js 
const mongoose_1 = __importDefault(require("mongoose"));
mongoose_1.default.set('useCreateIndex', true);
async function removeAllCollections() {
    const collections = Object.keys(mongoose_1.default.connection.collections);
    for (const collectionName of collections) {
        const collection = mongoose_1.default.connection.collections[collectionName];
        await collection.deleteMany({});
    }
}
exports.removeAllCollections = removeAllCollections;
async function dropAllCollections() {
    const collections = Object.keys(mongoose_1.default.connection.collections);
    for (const collectionName of collections) {
        const collection = mongoose_1.default.connection.collections[collectionName];
        try {
            await collection.drop();
        }
        catch (error) {
            // Sometimes this error happens, but you can safely ignore it
            if (error.message === 'ns not found')
                return;
            // This error occurs when you use it.todo. You can
            // safely ignore this error too
            if (error.message.includes('a background operation is currently running'))
                return;
            console.log(error.message);
        }
    }
}
exports.dropAllCollections = dropAllCollections;
