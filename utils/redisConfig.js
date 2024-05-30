import { configDotenv } from "dotenv";
configDotenv();
import { createClient } from "redis";
let redisUrl =
  process.env.NODE_ENV === "production"
    ? process.env.Redis_Url_Pro
    : process.env.Redis_Url_Dev;

let redisClient;

export async function redisConnection() {
  if (redisUrl) {
    redisClient = createClient({ host: redisUrl });
    redisClient.on("error", (err) => {
      console.log("Redis Client Error", err);
      throw new Error("Redis Client Error", err);
    });
    try {
      await redisClient.connect();
      console.log("Connected to Redis");
    } catch (error) {
      console.error("Error connecting to Redis");
      console.error(error);
    }
  }
}

export function isRedisWorking() {
  return !!redisClient?.isOpen;
}

export { redisClient };
