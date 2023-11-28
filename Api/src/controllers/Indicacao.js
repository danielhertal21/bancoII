import redis, { dataToArray } from '../database/redis.js';
import mongo from '../database/mongo.js';

const rd = await redis();
const mg = await mongo();

async function consultaIndicacao(req, res) {
   try {
      const dados = await rd.json.get("indicacao")

      res.setHeader("cache", !!dados);

      if (dados) {
         return res.status(200).send(dataToArray(dados));
      } else {

         let data = await mg.collection('indicacao').find().toArray();

         try {
            await rd.json.set('indicacao', '$', {})
            await Promise.all(data.map(async d => {
               await rd.json.set('indicacao', `$.${d._id}`, d)
            }))
         } catch (e) {
            console.log(e)
         }
         data = await rd.json.get("indicacao")
         return res.json(dataToArray(data));
      }
   } catch (e) {
      console.log(e)
      return res.status(500).send()
   }
}

export default { consultaIndicacao }