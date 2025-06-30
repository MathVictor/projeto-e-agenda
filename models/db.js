const { MongoClient, ServerApiVersion } = require('mongodb');


const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function connect() {
  if (!client.topology || !client.topology.isConnected()) {
    await client.connect();
  }
  return client.db();
}

module.exports = { connect };

   