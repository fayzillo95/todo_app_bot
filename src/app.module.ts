import { Module } from '@nestjs/common';
import { BotModule } from './bot/bot.module';
import { CoreModule } from './core/core.module';

@Module({
  imports: [CoreModule,BotModule],
})
export class AppModule {}
