import { Module } from "@nestjs/common";
import { BotService } from "./bot.service";
import { UserService } from "./user.service";


@Module({
    imports : [],
    providers : [UserService,BotService]
})

export class BotModule{}