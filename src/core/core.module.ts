import { Module } from "@nestjs/common";
import { PrismaModule } from "./prisma/prisma.module";
import { ConfigModule } from "@nestjs/config";

@Module({
    imports : [
        ConfigModule.forRoot({
            isGlobal : true,
            envFilePath : [
                ".env"
            ]
        }),
        PrismaModule
    ]
})

export class CoreModule{}