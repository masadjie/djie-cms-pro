const Redis = require('ioredis');
const logger = require('./logger');

let redisClient = null;
let isRedisConnected = false;
const inMemoryCache = new Map();

const REDIS_HOST = process.env.REDIS_HOST || '127.0.0.1';
const REDIS_PORT = parseInt(process.env.REDIS_PORT || '6388', 10);
const REDIS_PASSWORD = process.env.REDIS_PASSWORD || undefined;

try {
  redisClient = new Redis({
    host: REDIS_HOST,
    port: REDIS_PORT,
    password: REDIS_PASSWORD,
    retryStrategy(times) {
      const delay = Math.min(times * 100, 3000);
      return delay;
    },
    maxRetriesPerRequest: 3,
    enableReadyCheck: true,
    lazyConnect: true
  });

  redisClient.connect().then(() => {
    isRedisConnected = true;
    logger.info(`⚡ Redis Cache Connected successfully to ${REDIS_HOST}:${REDIS_PORT}`);
  }).catch((err) => {
    isRedisConnected = false;
    logger.warn(`⚠️ Redis Connection warning: ${err.message}. Using In-Memory cache fallback.`);
  });

  redisClient.on('connect', () => {
    isRedisConnected = true;
    logger.info('Redis cache instance connected.');
  });

  redisClient.on('error', (err) => {
    isRedisConnected = false;
    logger.warn(`Redis Client Error: ${err.message}`);
  });
} catch (e) {
  logger.warn(`Redis initialization failed: ${e.message}. Using In-Memory cache fallback.`);
}

/**
 * Get cached value (from Redis or In-Memory)
 */
async function getCache(key) {
  try {
    if (isRedisConnected && redisClient) {
      const data = await redisClient.get(key);
      return data ? JSON.parse(data) : null;
    } else {
      const mem = inMemoryCache.get(key);
      if (mem && mem.expires > Date.now()) {
        return mem.value;
      }
      return null;
    }
  } catch (error) {
    logger.error(`Error getCache for key [${key}]: ${error.message}`);
    return null;
  }
}

/**
 * Set cache with TTL in seconds (default: 300s = 5 mins)
 */
async function setCache(key, value, ttlSeconds = 300) {
  try {
    const serialized = JSON.stringify(value);
    if (isRedisConnected && redisClient) {
      await redisClient.setex(key, ttlSeconds, serialized);
    } else {
      inMemoryCache.set(key, {
        value,
        expires: Date.now() + ttlSeconds * 1000
      });
    }
    return true;
  } catch (error) {
    logger.error(`Error setCache for key [${key}]: ${error.message}`);
    return false;
  }
}

/**
 * Delete specific cache key
 */
async function deleteCache(key) {
  try {
    if (isRedisConnected && redisClient) {
      await redisClient.del(key);
    } else {
      inMemoryCache.delete(key);
    }
    return true;
  } catch (error) {
    logger.error(`Error deleteCache for key [${key}]: ${error.message}`);
    return false;
  }
}

/**
 * Delete keys matching pattern (e.g. "berita:*")
 */
async function deletePattern(pattern) {
  try {
    if (isRedisConnected && redisClient) {
      const keys = await redisClient.keys(pattern);
      if (keys && keys.length > 0) {
        await redisClient.del(...keys);
      }
    } else {
      for (const key of inMemoryCache.keys()) {
        const regex = new RegExp(`^${pattern.replace(/\*/g, '.*')}$`);
        if (regex.test(key)) {
          inMemoryCache.delete(key);
        }
      }
    }
    return true;
  } catch (error) {
    logger.error(`Error deletePattern [${pattern}]: ${error.message}`);
    return false;
  }
}

/**
 * Helper: Cache-Aside pattern
 */
async function getOrSetCache(key, fetchFn, ttlSeconds = 300) {
  const cached = await getCache(key);
  if (cached !== null && cached !== undefined) {
    return cached;
  }
  const freshData = await fetchFn();
  if (freshData !== null && freshData !== undefined) {
    await setCache(key, freshData, ttlSeconds);
  }
  return freshData;
}

module.exports = {
  redisClient,
  getCache,
  setCache,
  deleteCache,
  deletePattern,
  getOrSetCache
};
