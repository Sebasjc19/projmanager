import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import * as dotenv from 'dotenv';
import { join } from 'path';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';

dotenv.config({ path: join(__dirname, '..', '..', '..', '.env') });

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new ResponseInterceptor());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
