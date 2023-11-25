import { MongoClient, Db } from "mongodb";

let mongo

/**
 * 
 * @returns {Promise<Db>}
 */
async function connect() {
   if (mongo) return mongo;

   const client = new MongoClient(process.env.MONGO_HOST, {
      auth: {
         username: process.env.MONGO_USER,
         password: process.env.MONGO_PASS
      }
   });
   await client.connect();

   mongo = client.db(process.env.MONGO_DATABASE);
   // mongo.createCollection('trabalho2')
   return mongo;
}

export default connect 