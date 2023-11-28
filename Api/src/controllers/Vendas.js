import postgres from '../database/postgres.js'
import redis, { dataToArray } from '../database/redis.js'
import mongo from '../database/mongo.js'

const pg = await postgres();
const rd = await redis();
const mg = await mongo();

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */
async function criarVenda(req, res) {
   const { produto, quantidade, nome, email } = req.body;

   if (!produto) return res.status(400).json({ error: "Produto não informado." });
   if (!quantidade || quantidade < 1) return res.status(400).json({ error: "Quantidade não informado." });
   if (!nome) return res.status(400).json({ error: 'Nome não informado' });
   if (!email) return res.status(400).json({ error: 'Email não informado.' });

   let prod = await pg.query('SELECT codigo, nome, preco FROM "Produto" where codigo = $1', [produto]);

   if (!prod.rowCount) return res.status(400).json({ error: 'Produto não encontrado.' });

   prod = prod.rows[0];

   try {
      const vend = (await pg.query(`INSERT INTO "Venda" (produto,quantidade,valor_unitario,valor_total,data,cliente) VALUES($1,$2,$3,$4,$5,$6) RETURNING codigo`, [prod.codigo, quantidade, prod.preco, quantidade * prod.preco, new Date(), req.userId])).rows[0]

      const indica = await mg.collection('indicacao').insertOne({ nome, email, produto_id: prod.codigo, produto: prod.nome, cliente_id: req.userId, cliente: req.userName })

      const vend2 = (await pg.query(`
         SELECT vd.*, pd.nome as produto_nome, cli.nome as cliente_nome FROM "Venda" as vd 
         inner join "Produto" as pd ON pd.codigo = vd.produto 
         inner join "Cliente" as cli ON cli.codigo = vd.cliente
         where vd.codigo = $1
         order by vd.codigo desc;`, [vend.codigo])).rows[0];

      const red = await rd.KEYS('*')
      if (!red.find(v => v == 'vendas')) {
         await rd.json.set('vendas', '$', {});
         const vendas = (await pg.query(`
         SELECT vd.*, pd.nome as produto_nome, cli.nome as cliente_nome FROM "Venda" as vd 
         inner join "Produto" as pd ON pd.codigo = vd.produto 
         inner join "Cliente" as cli ON cli.codigo = vd.cliente
         where vd.codigo <> $1
         order by vd.codigo desc;`, [vend.codigo])).rows;
         await Promise.all(vendas.map(async v => await rd.json.set('vendas', `$.${v.codigo}`, v)))
      }
      if (!red.find(v => v == 'indicacao')) {
         await rd.json.set('indicacao', '$', {});
         const mong_data = await mg.collection('indicacao').find({ _id: { $ne: indica.insertedId } }).toArray();
         await Promise.all(mong_data.map(async m => await rd.json.set('indicacao', `$.${m._id.toString()}`, m)));
      }

      await rd.json.set('vendas', `$.${vend2.codigo}`, vend2)

      await rd.json.set('indicacao', `$.${indica.insertedId.toString()}`, { _id: indica.insertedId.toString(), nome, email, produto_id: prod.codigo, produto: prod.nome, cliente_id: req.userId, cliente: req.userName });

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
   let dados = await rd.json.get("vendas")
   res.setHeader("cache", !!dados);

   if (dados) {
      return res.status(200).json(dataToArray(dados));
   } else {
      const data = (await pg.query(
         `
         SELECT vd.*, pd.nome as produto_nome, cli.nome as cliente_nome FROM "Venda" as vd 
         inner join "Produto" as pd ON pd.codigo = vd.produto 
         inner join "Cliente" as cli ON cli.codigo = vd.cliente
         order by vd.codigo desc;
         `
      )).rows;

      if (data.length) {
         try {
            await rd.json.set('vendas', '$', {})
            await Promise.all(data.map(async d => await rd.json.set('vendas', `$.${d.codigo}`, d)))
         } catch (e) {
            console.log(e)
         }
      };
      dados = await rd.json.get("vendas")

      return res.json(dataToArray(dados));
   }
}


export default { criarVenda, buscarVendas }