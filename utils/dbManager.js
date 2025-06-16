const mongoose = require('mongoose');
const connections = {}; // cache per appId

async function getDbConnection(appId) {
  if (connections[appId]) {
    return connections[appId];
  }

  const envKey = `MONGO_URI_${appId.toUpperCase()}`;
  const uri = process.env[envKey];
  if (!uri) throw new Error(`Missing MONGO_URI for ${envKey}`);

  const conn = await mongoose.createConnection(uri);

  connections[appId] = conn;
  return conn;
}

module.exports = getDbConnection;