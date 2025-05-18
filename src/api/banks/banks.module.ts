import { Module } from '@nestjs/common';

import { FoodController } from './food/food.controller';
import { NumberController } from './number/number.controller';

@Module({
    controllers: [FoodController, NumberController],
})
export class BanksModule {}
