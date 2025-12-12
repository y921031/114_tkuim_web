import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI);
let db = null;

export async function connectDB() {
  try {
    await client.connect();
    console.log('Successfully connected to MongoDB');
    // 從 URI 中抓取資料庫名稱，若無則預設 week12
    db = client.db(); 
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
}

export function getCollection(collectionName) {
  if (!db) {
    throw new Error('Database not initialized. Call connectDB first.');
  }
  return db.collection(collectionName);
}