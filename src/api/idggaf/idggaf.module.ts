import { Module } from '@nestjs/common';

import { FetcherController } from './fetcher/fetcher.controller';
import { SchedulersController } from './scheduler/schedulers.controller';
import { SchedulerController } from './scheduler/scheduler.controller';
import { SchedulesController } from './scheduler/schedules.controller';

@Module({
    imports: [],
    controllers: [FetcherController, SchedulersController, SchedulerController, SchedulesController],
    providers: [],
})
export class IDGGAFModule {}
