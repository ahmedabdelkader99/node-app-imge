const express = require("express");
const mongoose = require("mongoose");
const redis = require("redis");

const PORT = process.env.PORT || 4000;
const app = express();

// redis
const Redis_PORT = 6379;
const REDIS_HOST = "redis";
const client = redis.createClient({
  url: `redis://${REDIS_HOST}:${Redis_PORT}`,
});

client.on("error", (err) => console.error("Redis Client Error", err));
client.on("connect", () => console.log("Connecting to Redis..."));
client.connect();

//mongo db
const DB_USERNAME = "root";
const DB_PASSWORD = "example";
const DB_PORT = 27017;
const DB_HOST = "mongo";

const uri = `mongodb://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}`;
mongoose
  .connect(uri)
  .then(() => {
    console.log("Connecting to mongodb...");
  })
  .catch((err) => {
    console.log(" Error:   " + err);
  });

//// routes
//caching data from db using redis (set , get)
app.get("/", function (req, res) {
  client.set("products", "products - value");
  res.send("Hello ahmed Abdelkader dev ");
});

app.get("/data", async function (req, res) {
  const products = await client.get("products");
  res.send(`<h1>${products}</h1>`);
});
app.listen(PORT, () => {
  console.log(`app is runing on port ${PORT}`);
});
