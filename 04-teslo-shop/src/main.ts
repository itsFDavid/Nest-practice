import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );

  const config = new DocumentBuilder()
    .setTitle('Teslo Restful API')
    .setDescription('The Teslo API is a RESTful API that allows you to interact with the Teslo application.')
    .setVersion('1.0')
    .build();
  
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('/api', app, document);

  await app.listen(process.env.PORT ?? 3000);
  logger.log(`Server running on http://localhost:${process.env.PORT ?? 3000}`, 'Bootstrap');
}
bootstrap();
