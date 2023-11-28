import redis from '../database/redis.js';
import mongo from '../database/mongo.js';

const rd = await redis();
const mg = await mongo();

async function consultaIndicacao(req, res) {
   const dados = await rd.get("indicacao")

   res.setHeader("cache", !!dados);

   if (dados) {
      return res.status(200).send(dados);
   } else {
      const data = await mg.collection('indicacoes').find().toArray();
      console.log(data)
      // if (data.length) rd.set('indicacao', JSON.stringify(data), { EX: process.env.REDIS_TMP_CACHE });
      return res.send(data);
   }
}

export default { consultaIndicacao }