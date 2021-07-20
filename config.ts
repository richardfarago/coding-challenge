import * as redisStore from 'cache-manager-redis-store';

export default () => ({
    rmq_datastream_options: {
        urls: [`amqp://${process.env.RABBITMQ_DEFAULT_USER}:${process.env.RABBITMQ_DEFAULT_PASS}@${process.env.RABBITMQ_HOST}:${process.env.RABBITMQ_PORT}`],
        queue: process.env.RABBITMQ_DATA_QUEUE_NAME,
        queueOptions: { durable: true }
    },
    rmq_worker_options: {
        urls: [`amqp://${process.env.RABBITMQ_DEFAULT_USER}:${process.env.RABBITMQ_DEFAULT_PASS}@${process.env.RABBITMQ_HOST}:${process.env.RABBITMQ_PORT}`],
        queue: process.env.RABBITMQ_WORKER_QUEUE_NAME,
        queueOptions: { durable: true }
    },
    redis_options: {
        store: redisStore,
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
        ttl: 600
    }
});