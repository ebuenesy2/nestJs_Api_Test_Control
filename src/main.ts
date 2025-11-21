import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  
  // Tüm originlere izin ver
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: '*',
  });

  const port = configService.get('PORT') ?? 3001;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
  
}
bootstrap();
