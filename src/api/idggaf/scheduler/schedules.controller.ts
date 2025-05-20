import { Controller, Get, Post, Put, Delete, Param, Res, Body, Query, BadRequestException } from '@nestjs/common';
import { Response } from 'express';

import { Schedule, Scheduler } from '.';
import { AppRequest } from 'src/utils/types';

export class ScheduleInput {
    toPostAt: string | number;
    webhook?: string;
    content: string;
    details?: Record<string, any>;
}

export class ScheduleEditInput {
    creationTime?: string | number;
    toPostAt?: string | number;
    posted?: boolean;
    webhook?: string | null;
    content?: string;
    details?: Record<string, any>;
}

@Controller('schedules')
export class SchedulesController {
    @Get(':scheduler')
    async schedules(
        @Param('scheduler') scheduler: string,
        @Query('id') _id: string,
        @Res() req: AppRequest,
        @Res() res: Response,
    ) {
        try {
            const { schedules, author } = await Scheduler.load(scheduler);

            if (!req.admin && (!author.startsWith('user:') || req.user?.id !== author.substring('user:'.length)))
                return res.status(401).json({ error: new Error('Unauthorized') });

            const id = _id ? parseInt(_id) : undefined;

            if (_id && !isNaN(id!)) return res.status(200).json({ result: schedules.find((s) => s.id === id) });
            else return res.status(200).json({ results: schedules });
        } catch (error: unknown) {
            console.log('Error on fetching schedules:', error);

            return res.status(400).json({ error });
        }
    }

    @Post(':scheduler')
    async addSchedule(
        @Param('scheduler') _scheduler: string,
        @Body() body: ScheduleInput,
        @Res() req: AppRequest,
        @Res() res: Response,
    ) {
        try {
            const scheduler = await Scheduler.load(_scheduler);
            if (
                !req.admin &&
                (!scheduler.author.startsWith('user:') || req.user?.id !== scheduler.author.substring('user:'.length))
            )
                return res.status(401).json({ error: new Error('Unauthorized') });

            const schedule = await scheduler.makeSchedule(
                new Date(body.toPostAt),
                body.content,
                body.webhook,
                body.details,
            );

            return res.status(200).json({ result: schedule });
        } catch (error: unknown) {
            console.log('Error on adding schedule:', error);

            return res.status(400).json({ error });
        }
    }

    @Put(':id')
    async editSchedule(
        @Param('id') _id: string,
        @Body() body: ScheduleEditInput,
        @Res() req: AppRequest,
        @Res() res: Response,
    ) {
        try {
            const id = parseInt(_id);

            if (isNaN(id)) throw new BadRequestException('Invalid id!');

            const { schedule, scheduler } = await Schedule.loadWithParent(id);

            if (
                !req.admin &&
                (!scheduler.author.startsWith('user:') || req.user?.id !== scheduler.author.substring('user:'.length))
            )
                return res.status(401).json({ error: new Error('Unauthorized') });

            await schedule.wait();

            if (body.creationTime) schedule.creationTime = new Date(body.creationTime);
            if (body.toPostAt) schedule.toPostAt = new Date(body.toPostAt);
            if (body.posted !== undefined) schedule.posted = body.posted;
            if ('webhook' in body) schedule.webhook = body.webhook || undefined;
            if (body.content) schedule.content = body.content;
            if (body.details) schedule.details = body.details;

            await schedule.wait();

            return res.status(200).json({ result: schedule });
        } catch (error: unknown) {
            console.log('Error on editing schedule:', error);

            return res.status(400).json({ error });
        }
    }

    @Delete(':id')
    async deleteSchedule(@Param('id') _id: string, @Res() req: AppRequest, @Res() res: Response) {
        try {
            const id = parseInt(_id);

            if (isNaN(id)) throw new BadRequestException('Invalid id!');

            const { schedule, scheduler } = await Schedule.loadWithParent(id);

            if (
                !req.admin &&
                (!scheduler.author.startsWith('user:') || req.user?.id !== scheduler.author.substring('user:'.length))
            )
                return res.status(401).json({ error: new Error('Unauthorized') });

            return res.status(200).json({ result: await schedule.delete() });
        } catch (error: unknown) {
            console.log('Error on deleting schedule:', error);

            return res.status(400).json({ error });
        }
    }
}
