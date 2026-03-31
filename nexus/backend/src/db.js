"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDB = exports.connectDB = void 0;
const mongodb_1 = require("mongodb");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const uri = process.env.DATABASE_URL || "mongodb://localhost:27017/NexusDB";
const client = new mongodb_1.MongoClient(uri);
let db;
const connectDB = async () => {
    try {
        await client.connect();
        db = client.db();
        console.log("Connected successfully to MongoDB");
    }
    catch (e) {
        console.error("MongoDB connection failed", e);
        process.exit(1);
    }
};
exports.connectDB = connectDB;
const getDB = () => db;
exports.getDB = getDB;
//# sourceMappingURL=db.js.map