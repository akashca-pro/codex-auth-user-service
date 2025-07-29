import Redis from 'ioredis';
import { config } from '.';
import logger from '@/utils/logger';
import { RedisEvents } from './enums/redis';

class RedisClient {
    private static instance : Redis
    private static isConnected = false;

    private constructor() {}

    public static getInstance() : Redis {
        if(!RedisClient.instance){
            RedisClient.instance = new Redis(config.REDIS_URL, {
                retryStrategy : (times : number) => {
                    const delay = Math.min(times * 50,2000);
                    return delay
                },
                maxRetriesPerRequest : 3,
            });
            RedisClient.setupEventListeners();
        }
        return RedisClient.instance
    }

    public static setupEventListeners() : void {
        RedisClient.instance.on(RedisEvents.READY,()=>{
            RedisClient.isConnected = true;
            logger.info('Redis is ready');
        })

    RedisClient.instance.on(RedisEvents.ERROR, (error) => {
      RedisClient.isConnected = false;
      logger.error('Redis connection error:', error);
    });

    RedisClient.instance.on(RedisEvents.CLOSE, () => {
      RedisClient.isConnected = false;
      logger.warn('Redis connection closed');
    });

    RedisClient.instance.on(RedisEvents.RECONNECTING, () => {
      logger.info('Reconnecting to Redis...');
    });
    }

    public static isReady() : boolean {
        return RedisClient.isConnected
    }
}

export default RedisClient.getInstance();