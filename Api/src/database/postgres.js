import pkg from "pg";

let postgres;

/**
 * 
 * @returns {Promise<pkg.Pool>}
 */
export default async function connect() {
   if (postgres) {
      return postgres
   };

   postgres = new pkg.Pool({
      host: process.env.POSTG_HOST,
      port: process.env.POSTG_PORT,
      database: process.env.POSTG_DATABASE,
      user: process.env.POSTG_USER,
      password: process.env.POSTG_PASS
   });

   await postgres.connect();

   return postgres;
}

export async function CriarTabelas() {
   const db = await connect();
   await db.query(`
      CREATE TABLE IF NOT EXISTS "Cliente"
      (
         codigo integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 9999999 CACHE 1 ),
         nome character varying(60),
         cpf character varying(20),
         email character varying(60),
         senha character varying(255),
         endereco character varying(255),
         cidade character varying(80),
         uf character varying(2),
         PRIMARY KEY (codigo),
         UNIQUE NULLS NOT DISTINCT (email)
      );
   `)

   await db.query(`
      CREATE TABLE IF NOT EXISTS public."Produto"
      (
         codigo integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 9999999 CACHE 1 ),
         nome character varying(80),
         descricao text,
         imagem character varying(255),
         preco numeric(10, 2),
         PRIMARY KEY (codigo)
      );
   `)

   await db.query(`
   CREATE TABLE IF NOT EXISTS public."Venda"
   (
       codigo integer NOT NULL,
       produto integer NOT NULL,
       quantidade integer,
       valor_unitario numeric(6, 2),
       valor_total numeric(6, 2),
       data date,
       cliente integer NOT NULL,
       PRIMARY KEY (codigo),
       CONSTRAINT fk_venda_produto FOREIGN KEY (produto)
           REFERENCES public."Produto" (codigo) MATCH SIMPLE
           ON UPDATE NO ACTION
           ON DELETE NO ACTION
           NOT VALID,
       CONSTRAINT fk_venda_cliente FOREIGN KEY (cliente)
           REFERENCES public."Cliente" (codigo) MATCH SIMPLE
           ON UPDATE NO ACTION
           ON DELETE NO ACTION
           NOT VALID
   );
   `)
}