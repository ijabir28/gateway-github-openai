require('dotenv').config();

const MongoClient = require('mongodb').MongoClient;

const client = new MongoClient(process.env.MONGODB_HOST);

async function get_connection() {
    await client.connect();
    return client;
}

module.exports = get_connection;
