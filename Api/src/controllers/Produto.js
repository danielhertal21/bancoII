import express from 'express';
import redis from '../database/redis.js'
import postgres from '../database/postgres.js'

/**
 * @param {express.Request} req
 * @param {express.Response} res
 * @returns {Provider<express.Response>}
 */
export default async (req, res) => {
   const rg = await redis();
   const pg = await postgres();

   const dados = await rg.json.get("produtos")

   res.setHeader("cache", !!dados);

   if (dados) {
      return res.json(dados);
   } else {
      const data = (await pg.query('SELECT * FROM "Produto";')).rows;
      if (data.length) rg.json.set('produtos', '$', data);
      return res.json(data);
   }
}