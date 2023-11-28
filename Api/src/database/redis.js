import red from 'redis';


let redis;

/**
 * 
 * @returns {Promise<red.RedisClientType>}
 */
export default async function connect() {
   if (redis) {
      return redis
   };

   redis = await red.createClient({
      url: process.env.REDIS_URL
   }).connect()

   return redis;
}

/**
 * 
 * @param {Map} data 
 * @returns {[]}
 */
export function dataToArray(data) {
   let array = []
   for (let k in data) {
      array.push(data[k])
   }
   return array
}

export async function LimparRedis() {
   let rd = await connect();
   await rd.flushAll()
}

