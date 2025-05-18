import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';

import db from 'src/utils/database';

import { Scheduler } from './.';

@Controller('schedulers')
export class SchedulersController {
    @Get()
    async schedulers(@Res() res: Response) {
        try {
            const schedulers = await Promise.all(
                (await db.scheduler.findMany({ include: { schedules: true } })).map(
                    (scheduler) => new Scheduler(scheduler),
                ),
            );

            return res.status(200).json({ results: schedulers });
        } catch (error: unknown) {
            console.log('Error on fetching scheduler:', error);

            return res.status(400).json({ error });
        }
    }
}
