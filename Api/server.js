import "dotenv/config.js";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

import routes from "./src/routes.js";


import { CriarTabelas } from "./src/database/postgres.js";
import { LimparRedis } from './src/database/redis.js'

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.disable('x-powered-by');

(async () => {

   await CriarTabelas();

   await LimparRedis();

   app.use(routes);

   app.listen(process.env.PORT, () => {
      console.log("ON: " + process.env.PORT)
   })

})()


