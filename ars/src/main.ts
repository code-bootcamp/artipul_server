import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cors from 'cors';
import { graphqlUploadExpress } from 'graphql-upload';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:3000',
    allowedHeaders: ['Access-Control-Request-Headers', 'Authorization'],
  });
  app.use(graphqlUploadExpress());
  await app.listen(3000);
}
bootstrap();
