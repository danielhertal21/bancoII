import express, { Router } from "express";

import Login from "./controllers/Login.js";
import Cadastro from "./controllers/Cadastro.js";
import Autenticar from "./middleware/Autenticar.js";
import Produto from "./controllers/Produto.js";
import Vendas from "./controllers/Vendas.js";
import Indicacao from "./controllers/Indicacao.js";

const routes = Router();

routes.post("/login", Login);
routes.post("/cadastro", Cadastro);

routes.get("/produtos", Produto)

routes.use('/public', express.static('public'))

routes.route('/venda')
   .get(Vendas.buscarVendas)
   .post(Autenticar, Vendas.criarVenda)

routes.get('/indicacao', Indicacao.consultaIndicacao)

export default routes;