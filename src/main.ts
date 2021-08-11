// Lib
import { NestFactory } from '@nestjs/core';

// App
import { AppModule } from '@app/app.module';

// Socket
import { SocketAdapter } from '@app/socket.adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useWebSocketAdapter(new SocketAdapter(app));
  app.enableCors();
  await app.listen(3001);
}
bootstrap();
