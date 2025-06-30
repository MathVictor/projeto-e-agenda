const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://capitajp7:<db_password>@agenda.msjcrsn.mongodb.net/?retryWrites=true&w=majority&appName=Agenda";

async function test() {
  try {
    const client = new MongoClient(uri);
    await client.connect();
    console.log('Conectado com sucesso ao MongoDB Atlas');
    await client.close();
  } catch (err) {
    console.error(' Erro de conexão:', err.message);
  }
}

test();
