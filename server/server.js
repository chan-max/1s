import Koa from "koa";
import Router from "koa-router";
import cors from "koa2-cors";
import jwt from "jsonwebtoken";
import path from "path";
import _static from "koa-static";
import { koaBody } from "koa-body";
import { fileURLToPath } from "url";
import { initRouter } from "./router.js"
import os from 'os'
import fs from 'fs'

import { getUploadPath } from "./fileManage.js"

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = new Koa();
const router = new Router();

import db from './sequelize/models/index.js'

initRouter(router, db.sequelize, app);

// 前端打包后的代码
app.use(_static(path.join(__dirname, "../dist")));

app.use(_static(path.join(__dirname, "../static")));

import { uploadsPath } from "./fileManage.js"

app.use(_static(uploadsPath));


app.use(cors({ origin: "*", credentials: true }));

app.use(koaBody({ multipart: true ,    
    formidable: {
    // 上传目录
    uploadDir : getUploadPath(),
    // 保留文件扩展名
    keepExtensions: true,
}}));


app.use(router.routes());
app.use(router.allowedMethods());

await app.listen(3000);
console.log("server is running at http://localhost:3000");