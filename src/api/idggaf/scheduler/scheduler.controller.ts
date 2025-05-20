import { Controller, Get, Post, Put, Delete, Param, Req, Res, Body } from '@nestjs/common';
import { Response } from 'express';
import { AppRequest } from 'src/utils/types';

import { Scheduler } from './.';

export class SchedulerInput {
    detailedName: string;
}

export class SchedulerEditInput {
    detailedName: string;
}

@Controller('scheduler')
export class SchedulerController {
    @Get(':scheduler')
    async scheduler(@Param('scheduler') _scheduler: string, @Req() req: AppRequest, @Res() res: Response) {
        try {
            const scheduler = await Scheduler.load(_scheduler);

            if (
                !req.admin &&
                (!scheduler.author.startsWith('user:') || req.user?.id !== scheduler.author.substring('user:'.length))
            )
                return res.status(401).json({ error: new Error('Unauthorized') });

            return res.status(200).json({ result: scheduler });
        } catch (error: unknown) {
            console.log('Error on fetching scheduler:', error);

            return res.status(400).json({ error });
        }
    }

    @Post(':scheduler')
    async addScheduler(
        @Param('scheduler') _scheduler: string,
        @Body() body: SchedulerInput,
        @Req() req: AppRequest,
        @Res() res: Response,
    ) {
        try {
            const scheduler = await Scheduler.make(
                _scheduler,
                body.detailedName,
                req.user ? `user:${req.user.id}` : 'system:admin',
            );

            return res.status(200).json({ result: scheduler });
        } catch (error: unknown) {
            console.log('Error on adding scheduler:', error);

            return res.status(400).json({ error });
        }
    }

    @Put(':scheduler')
    async editScheduler(
        @Param('scheduler') _scheduler: string,
        @Body() body: SchedulerEditInput,
        @Req() req: AppRequest,
        @Res() res: Response,
    ) {
        try {
            const scheduler = await Scheduler.load(_scheduler);

            if (
                !req.admin &&
                (!scheduler.author.startsWith('user:') || req.user?.id !== scheduler.author.substring('user:'.length))
            )
                return res.status(401).json({ error: new Error('Unauthorized') });

            await scheduler.wait();

            scheduler.detailedName = body.detailedName;

            await scheduler.wait();

            return res.status(200).json({ result: scheduler });
        } catch (error: unknown) {
            console.log('Error on editing scheduler:', error);

            return res.status(400).json({ error });
        }
    }

    @Delete(':scheduler')
    async deleteScheduler(@Param('scheduler') _scheduler: string, @Res() req: AppRequest, @Res() res: Response) {
        try {
            const scheduler = await Scheduler.load(_scheduler);

            if (
                !req.admin &&
                (!scheduler.author.startsWith('user:') || req.user?.id !== scheduler.author.substring('user:'.length))
            )
                return res.status(401).json({ error: new Error('Unauthorized') });

            return res.status(200).json({ result: await scheduler.delete() });
        } catch (error: unknown) {
            console.log('Error on deleting schedule:', error);

            return res.status(400).json({ error });
        }
    }
}
