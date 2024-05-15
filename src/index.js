const express = require("express");
const { Client } = require ("pg")
const redis = require("redis");

const PORT = process.env.PORT || 4000;
const app = express();

// redis
const Redis_PORT = 6379;
const REDIS_HOST = "redis";
const rClient = redis.createClient({
  url: `redis://${REDIS_HOST}:${Redis_PORT}`,
});

rClient.on("error", (err) => console.error("Redis Client Error", err));
rClient.on("connect", () => console.log("Connecting to Redis..."));
rClient.connect();

//mongo db
const DB_USERNAME = "root";
const DB_PASSWORD = "example";
const DB_PORT = 5432;
const DB_HOST = "postgres";

const uri = `postgres://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}`;
const client = new Client({connectionString:uri})
 client.connect().then(() => {
    console.log("Connecting to postgres...");
  })
  .catch((err) => {
    console.log(" Error:   " + err);
  });

//// routes
//caching data from db using redis (set , get)
app.get("/", function (req, res) {
  rClient.set("products", "products - value");
  res.send("Hello ahmed Abdelkader dev ");
});

app.get("/data", async function (req, res) {
  const products = await client.get("products");
  res.send(`<h1>${products}</h1>`);
});
app.listen(PORT, () => {
  console.log(`app is runing on port ${PORT}`);
});
