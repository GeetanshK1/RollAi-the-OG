import { createClient } from "redis";
import "dotenv/config";

const client = createClient({
  url: process.env.REDIS_URL
});

client.on("error", (err) => {
  console.log("Redis Client Error", err);
});
export default client;