import { Controller, Get, Req, Res } from '@nestjs/common';
import { Response } from 'express';

import db from '@fpswagg/my-database';
import { AppRequest } from 'src/utils/types';

import { Scheduler } from './.';

@Controller('schedulers')
export class SchedulersController {
    @Get()
    async schedulers(@Req() req: AppRequest, @Res() res: Response) {
        try {
            if (!req.admin) return res.status(401).json({ error: new Error('Unauthorized') });

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
