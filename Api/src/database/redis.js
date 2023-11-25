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

export async function LimparRedis(){
   let rd = await connect();
   await rd.flushAll()
}

