// Libraries
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import * as helmet from 'helmet';

// App
import { AppModule } from '@app/app.module';

// Socket
import { SocketAdapter } from '@app/socket.adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Web os')
    .setDescription('The web os API description')
    .setVersion('0.2')
    .addTag('webOS')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.use(cookieParser());
  app.use(helmet());
  app.useWebSocketAdapter(new SocketAdapter(app));
  app.enableCors({
    credentials: true,
    origin: process.env.ORIGIN,
  });
  await app.listen(process.env.PORT);
}
bootstrap();
