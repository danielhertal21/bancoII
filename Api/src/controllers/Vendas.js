import postgres from '../database/postgres.js'
import redis from '../database/redis.js'

const pg = await postgres();
const rg = await redis();

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */
async function criarVenda(req, res) {
   const { produto, quantidade } = req.body;

   if (!produto) return res.status(400).json({ error: "Produto não informado." });
   if (!quantidade || quantidade < 1) return res.status(400).json({ error: "Quantidade não informado." });

   let prod = await pg.query('SELECT codigo, preco FROM "Produto" where codigo = $1', [produto]);

   if (!prod.rowCount) return res.status(400).json({ error: 'Produto não encontrado.' });

   prod = prod.rows[0];

   try {
      await pg.query(`INSERT INTO "Venda" (produto,quantidade,valor_unitario,valor_total,data,cliente) VALUES($1,$2,$3,$4,$5,$6)`, [prod.codigo, quantidade, prod.preco, quantidade * prod.preco, new Date(), req.userId])
   } catch (error) {
      return res.status(400).json({ error: 'Erro inesperado.' })
   }
   return res.status(201).json();
}

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */
async function buscarVendas(req, res) {
   const dados = await rg.get("vendas")

   res.setHeader("cache", !!dados);

   if (dados) {
      return res.status(200).send(dados);
   } else {
      const data = (await pg.query(
         `
         SELECT vd.*, pd.nome as produto_nome, cli.nome as cliente_nome FROM "Venda" as vd 
         inner join "Produto" as pd ON pd.codigo = vd.produto 
         inner join "Cliente" as cli ON cli.codigo = vd.cliente
         order by vd.codigo desc;
         `
      )).rows;
      if (data.length) rg.set('vendas', JSON.stringify(data), { EX: process.env.REDIS_TMP_CACHE });
      return res.send(data);
   }
}


export default { criarVenda, buscarVendas }