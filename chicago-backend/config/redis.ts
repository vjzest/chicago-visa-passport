import { createClient } from "redis";

const redisClient = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
  socket: {
    reconnectStrategy: (retries) => {
      if (retries > 5) {
        console.warn("❌ Redis reconnect attempts exceeded. Giving up.");
        return new Error("Redis retry limit exceeded");
      }
      // Delay in ms before next retry
      return Math.min(100 * retries, 1000);
    },
  },
});

(async () => {
  try {
    await redisClient.connect();
    console.log("✅ Redis connected");
  } catch (error: any) {
    console.warn("⚠️ Redis connection failed:", error.message);
  }
})();

export const clearRedisAdminCache = async (adminId: string) => {
  const redisKey = `admin_${adminId}`;
  try {
    await redisClient.del(redisKey);
  } catch (error) {
    return null;
  }
};

export const getRedisAdminCache = async (adminId: string) => {
  const redisKey = `admin_${adminId}`;
  try {
    const adminCache = await redisClient.get(redisKey);
    return adminCache;
  } catch (error) {
    return null;
  }
};

export const clearRedisCacheByKey = async (key: string) => {
  try {
    await redisClient.del(key);
  } catch (error) {
    return null;
  }
};

export { redisClient };
