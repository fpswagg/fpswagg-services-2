import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';

import { AuthController } from './auth/auth.controller';
import { AuthMiddleware } from './auth/auth.middleware';
import { BanksModule } from './banks/banks.module';
import { IDGGAFModule } from './idggaf/idggaf.module';

@Module({
    imports: [BanksModule, IDGGAFModule],
    controllers: [AuthController],
    providers: [],
})
export class ApiModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(AuthMiddleware)
            .exclude({ path: 'auth/*path', method: RequestMethod.ALL })
            .forRoutes({ path: '*', method: RequestMethod.ALL });
    }
}
