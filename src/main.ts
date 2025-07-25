
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv/config'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 Server is running on port: ${port}`);
  
}
bootstrap().then(() => {
  console.log("Main then ")
}).catch((error) => {
  console.log(error)
});