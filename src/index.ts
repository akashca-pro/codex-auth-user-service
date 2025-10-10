import './config/tracing';
import logger from '@/utils/pinoLogger';
import { startGrpcServer } from '@/presentation/grpc/server';
import dotenv from 'dotenv';
dotenv.config();

const startServer = () => {
    try {
        // start gRPC server.
        startGrpcServer();
    } catch (error) {
        logger.error('Failed to start server : ',error);
        process.exit(1);
    }
}

startServer();