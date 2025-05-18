import { port } from 'src/utils/variables';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { NestExpressApplication } from '@nestjs/platform-express';

import * as path from 'path';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    app.setViewEngine('ejs');
    app.setBaseViewsDir(path.join(__dirname, '..', 'views'));

    await app.listen(port);
}

void bootstrap();
