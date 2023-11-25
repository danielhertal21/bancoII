import express, { Router } from "express";

import Login from "./controllers/Login.js";
import Cadastro from "./controllers/Cadastro.js";
import Autenticar from "./middleware/Autenticar.js";
import Produto from "./controllers/Produto.js";

const routes = Router();

routes.post("/login", Login);
routes.post("/cadastro", Cadastro);

routes.get("/produtos", Produto)

routes.use('/public', express.static('public'))

export default routes;

/*
   Login
   Cadastro
   Produtos
   Compras
   Recomendacao
*/


// routes.post("login");

// routes.post("cadastro")

// routes.get("produtos")

// routes.post("vendas")