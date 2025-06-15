import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

export const redis = new Redis(process.env.UPSTASH_REDIS_URL, {
  tls: {}, // Required for rediss://
  maxRetriesPerRequest: null, // Optional: disables limit
  enableOfflineQueue: false, // Optional: disables queue during disconnection
});
