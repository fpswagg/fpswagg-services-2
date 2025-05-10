import { Module } from '@nestjs/common';

import { BanksModule } from './banks/banks.module';
import { IDGGAFModule } from './idggaf/idggaf.module';

@Module({
  imports: [ BanksModule, IDGGAFModule ],
  controllers: [],
  providers: [],
})
export class AppModule {}
