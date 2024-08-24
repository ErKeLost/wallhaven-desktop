import { createProxyMiddleware } from "http-proxy-middleware";
import express from "express";
import cors from "cors";
import morgan from "morgan";
const logger = morgan("tiny");
// Rest of the code...

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(logger);

const baseURL = 'https://wallhaven.cc/api/v1/'

// body parser middleware

//fix cors issue
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// baseURL
app.use("/", createProxyMiddleware({
  target: baseURL,
  changeOrigin: true,
  onProxyReq(proxyReq) {
    let url = proxyReq.path
    proxyReq.path = url.replace(/categories=[01]{3}/g, 'categories=100').replace(/purity=[01]{3}/g, 'purity=100')
  }
}));

const port = process.env.PORT || 8000;

async function bootstrap() {
  app.listen(port, () => {
    console.log("启动成功", port);
  });
}

bootstrap();