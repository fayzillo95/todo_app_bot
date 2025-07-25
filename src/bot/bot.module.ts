import { Module } from "@nestjs/common";
import { BotService } from "./bot.service";
import { UserService } from "./user.service";
import { BotController } from "./utils/bot.controller";


@Module({
    imports : [],
    controllers : [BotController],
    providers : [UserService,BotService]
})

export class BotModule{}