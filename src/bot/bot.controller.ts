import { Controller, Post, Req } from "@nestjs/common";
import { Request } from "express";
import { BotService } from "./bot.service";

@Controller()
export class BotController {
  constructor(private readonly botService: BotService) {}

  @Post("/webhook")
  async handleUpdate(@Req() req: Request) {
    await this.botService.handleUpdate(req.body);
    console.log(req.body)
    return { ok: true };
  }
}
