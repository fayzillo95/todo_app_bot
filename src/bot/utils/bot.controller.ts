import { Controller, Get, Req, Res } from "@nestjs/common";
import { BotService } from "../bot.service";
import { Request, Response } from "express";


@Controller()
export class BotController {
    constructor(private readonly botService: BotService) { }

    @Get("/")
    getChecker() {
        return {
            ok: true,
            success: true,
            statusCode: 200,
            message: "Bot is alive"
        };
    }

}