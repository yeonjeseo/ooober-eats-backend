import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

/**
 * appModule은 main.ts로 import 되는 유일한 모듈
 * -> appModule에 graphQL 을 추가
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();