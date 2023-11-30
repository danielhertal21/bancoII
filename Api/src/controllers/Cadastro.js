import express from "express"
import postgres from '../database/postgres.js'
import bcrypt from 'bcrypt';
import { gerarToken } from "./Login.js";



/**
 * @param {express.Request} req
 * @param {express.Response} res
 * @returns {Provider<express.Response>}
 */
export default async (req, res) => {

   let {
      nome,
      cpf,
      email,
      senha,
      endereco,
      cidade,
      uf
   } = req.body;

   if (!nome) return res.status(400).send({ error: 'Nome não informada' });
   if (!cpf) return res.status(400).send({ error: 'CPF não informada' });
   if (!email) return res.status(400).send({ error: 'Email não informada' });
   if (!senha) return res.status(400).send({ error: "Senha não informada" });
   if (uf) {
      if (uf.length > 2) return res.status(400).send({ error: "UF exedeu tamanho de 2 caractere" });
      if (uf.length == 1) return res.status(400).send({ error: "UF precisa ter tamanho de 2 caractere" });
   }

   const pg = await postgres();

   let dados = await pg.query('SELECT codigo from "Cliente" where email like $1;', [email]);

   if (dados.rows.length) return res.status(400).send({ error: "Email já cadastrado" });

   dados = await pg.query('SELECT codigo from "Cliente" where cpf like $1;', [cpf]);

   if (dados.rows.length) return res.status(400).send({ error: "CPF já cadastrado" });

   senha = bcrypt.hashSync(senha, 10);

   await pg.query('INSERT INTO "Cliente"(nome, cpf, email, senha, endereco, cidade, uf)	VALUES ($1, $2, $3, $4, $5, $6, $7);',
      [nome, cpf, email, senha, endereco, cidade, uf]);

   let client = (await pg.query('SELECT codigo, nome, email from "Cliente" where email like $1;', [email])).rows[0];

   const token = gerarToken(client);

   return res.status(201).send({ token });

}