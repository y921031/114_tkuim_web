// server/repositories/participants.js
import { ObjectId } from 'mongodb';
import { getDB } from '../db.js';

const collection = () => getDB().collection('participants');

export async function createParticipant(data) {
  const result = await collection().insertOne({
    ...data,
    createdAt: new Date(),
    updatedAt: new Date()
  });
  return result.insertedId;
}

// 1. 修正 listParticipants 函式以實作分頁 (skip/limit)
// 預設 skip=0, limit=10
export function listParticipants(skip = 0, limit = 10) {
  return collection()
    .find()
    .sort({ createdAt: -1 })
    .skip(skip)   // <-- MongoDB/Mongoose 的 skip 實作
    .limit(limit) // <-- MongoDB/Mongoose 的 limit 實作
    .toArray();
}

// 2. 新增 countParticipants 函式 (用於計算總筆數)
export function countParticipants() {
  return collection().countDocuments({});
}

export async function updateParticipant(id, patch) {
  return collection().updateOne(
    { _id: new ObjectId(id) },
    { $set: { ...patch, updatedAt: new Date() } }
  );
}

export function deleteParticipant(id) {
  return collection().deleteOne({ _id: new ObjectId(id) });
}