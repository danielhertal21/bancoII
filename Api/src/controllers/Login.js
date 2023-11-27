import express from "express"
import postgres from '../database/postgres.js'
import bcrypt from 'bcrypt';
import Jwt from "jsonwebtoken";



/**
 * @param {express.Request} req
 * @param {express.Response} res
 * @returns {Provider<express.Response>}
 */
export default async (req, res) => {

   const { email, senha } = req.body;

   if (!email) {
      return res.status(401).send({ error: 'Email não informada' });
   }

   if (!senha) {
      return res.status(401).send({ error: "Senha não informada" })
   }

   const pg = await postgres();
   
   let dados = await pg.query('SELECT codigo, nome, email, senha from "Cliente" where email like $1;', [email]);

   if (!dados.rowCount) return res.status(401).send({ error: "Email ou senha invalido" });

   let client = dados.rows[0];

   if (!bcrypt.compareSync(senha, client.senha)) return res.status(401).send({ error: "Email ou senha invalido" });

   delete client.senha;

   return res.send({ token: gerarToken(client) });

}

/**
 * 
 * @returns {string}
 */
export function gerarToken(payload) {
   return Jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: "8h", algorithm: 'HS256' })
}