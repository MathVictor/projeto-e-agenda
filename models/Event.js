require('dotenv').config();
const { MongoClient, ObjectId } = require('mongodb');

const uri = process.env.MONGO_URI;
const dbName = process.env.MONGO_DB;

const client = new MongoClient(uri);
let db;

async function connect() {
  if (!db) {
    await client.connect();
    db = client.db(dbName);
  }
  return db;
}

// ✅ CRIAR EVENTO
async function createEvent(data) {
  const db = await connect();
  return db.collection('eventos').insertOne(data);
}

// ✅ OBTER POR USUÁRIO
async function getEventsByUser(userId) {
  const db = await connect();
  return db.collection('eventos').find({ userId }).toArray();
}

// ✅ ATUALIZAR EVENTO
async function updateEvent(id, data) {
  const db = await connect();
  return db.collection('eventos').updateOne(
    { _id: new ObjectId(id) },
    { $set: data }
  );
}

// ✅ DELETAR EVENTO
async function deleteEvent(id, userId) {
  const db = await connect();
  return db.collection('eventos').deleteOne({
    _id: new ObjectId(id),
    userId
  });
}

// ✅ EXPORTAR TODAS
module.exports = {
  createEvent,
  getEventsByUser,
  updateEvent,
  deleteEvent
};
