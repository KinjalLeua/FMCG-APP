import express, { Express } from "express";
import http from "http";
import dotenv from "dotenv";
import dbConfig from "./config/db";
import router from "./routes";

import { swaggerDocs } from './helpers/swagger';
//Configuration
dotenv.config();
const app: Express = express();

app.use(express.json({ limit: "80mb" }), express.static("public"));
dbConfig(process.env.MONGODB_URI || "");
router(app);

app.use('/docs', swaggerDocs);

const httpServer = http.createServer(app);


httpServer.listen(process.env.PORT, () => {
    console.log(`HTTP Server is running on port ${process.env.PORT}`);
  });


