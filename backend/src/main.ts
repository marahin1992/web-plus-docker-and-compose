import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const PORT = process.env.PORT || 3001;
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('КупиПодариДай')
    .setDescription('API для приложения по сбору средств на подарки')
    .setVersion('1.0')
    .addTag('marahin')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: { persistAuthorization: true },
  });

  await app.listen(PORT, () => console.log(`Сервер запущен на порту ${PORT}`));
}
bootstrap();
