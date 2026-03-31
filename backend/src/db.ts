import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.DATABASE_URL || "mongodb://localhost:27017/NexusDB";
const client = new MongoClient(uri);

let db: import('mongodb').Db;

export const connectDB = async () => {
    try {
        await client.connect();
        db = client.db();
        console.log("Connected successfully to MongoDB");
    } catch (e) {
        console.error("MongoDB connection failed", e);
        process.exit(1);
    }
}

export const getDB = () => db;
