// ✅ User.js FINALIZADO
require('dotenv').config();
const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');

const client = new MongoClient(process.env.MONGO_URI);
let db;

async function connect() {
  if (!db) {
    await client.connect();
    db = client.db(process.env.MONGO_DB);
  }
  return db;
}

// 🔍 Buscar usuário por nome
async function getUserByUsername(username) {
  const db = await connect();
  return db.collection('users').findOne({ username });
}

// 💾 Criar novo usuário
async function createUser({ username, password }) {
  const db = await connect();
  const hashedPassword = await bcrypt.hash(password, 10);
  return db.collection('users').insertOne({ username, password: hashedPassword });
}

module.exports = {
  getUserByUsername,
  createUser
};
