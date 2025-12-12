import { ObjectId } from 'mongodb';
import { getCollection } from '../db.js';

const COLLECTION_NAME = 'participants';

export async function findAll() {
  // 管理員專用：撈出所有資料
  return getCollection(COLLECTION_NAME).find().toArray();
}

export async function findByOwner(ownerId) {
  // 一般學生專用：只撈出自己的資料
  return getCollection(COLLECTION_NAME).find({ ownerId }).toArray();
}

export async function findById(id) {
  return getCollection(COLLECTION_NAME).findOne({ _id: new ObjectId(id) });
}

export async function createParticipant(data) {
  // data 內必須包含 ownerId
  const result = await getCollection(COLLECTION_NAME).insertOne({
    ...data,
    createdAt: new Date()
  });
  return { ...data, _id: result.insertedId };
}

export async function deleteParticipant(id) {
  const result = await getCollection(COLLECTION_NAME).deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount > 0;
}