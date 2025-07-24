import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit,OnModuleDestroy{
    private logger : Logger
    
    async onModuleInit() {
        try {
            this.logger = new Logger()
            this.$connect()
            this.logger.log("Daytabase connected !") 
        } catch (error) {
            this.logger.error(error.message,error.stack || "")
        }
    }
    async onModuleDestroy() {
        try {
            this.$disconnect()
            this.logger.warn("Database disconnected !")
        } catch (error) {
            this.logger.error(error.message,error.stack || "")            
        }
    }
}