import { port, updateInterval } from 'src/utils/variables';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { NestExpressApplication } from '@nestjs/platform-express';

import * as path from 'path';
import Scheduler from './api/idggaf/scheduler';
import prisma from './utils/database';
import axios from 'axios';
import { ScheduleWebhookResponse } from './utils/types';
import FoodBank from './api/banks/food';

function asyncUpdate(func: () => Promise<any> = async () => {}, update = updateInterval) {
    let flag = false;

    return setInterval(function () {
        if (!flag) {
            flag = true;
            void func()
                .catch((error) => console.error('An error occurred:', error))
                .finally(() => (flag = false));
        }
    }, update);
}

// eslint-disable-next-line @typescript-eslint/require-await
async function initialize() {
    // Schedule updates
    asyncUpdate(async function () {
        const schedulers = (await prisma.scheduler.findMany({ include: { schedules: true } })).map(
            (s) => new Scheduler(s),
        );

        for (const scheduler of schedulers)
            for (const schedule of scheduler.schedules)
                if (schedule.toPostAt <= new Date())
                    if (schedule.webhook) {
                        console.log(`Updating schedule[${schedule.id}]`);
                        try {
                            const response = await axios.post<ScheduleWebhookResponse>(schedule.webhook, {
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                data: {
                                    scheduler: await scheduler.original(false),
                                    schedule: await schedule.original(false),
                                },
                            });

                            if (response.status >= 200 && response.status < 300) {
                                const {
                                    posted,
                                    reschedule,
                                    details,
                                    update,
                                    update_scheduler: update_scheduler_,
                                    'update scheduler': update_scheduler__,
                                } = response.data;

                                const update_scheduler = update_scheduler_ || update_scheduler__;

                                await schedule.wait();

                                if (posted !== undefined) schedule.posted = posted;
                                if (reschedule !== undefined) schedule.toPostAt = new Date(reschedule);
                                if (details !== undefined) schedule.details = { ...schedule.details, ...details };

                                await schedule.wait();

                                if (update) {
                                    await prisma.schedule.update({ where: { id: schedule.id }, data: update });
                                }

                                if (update_scheduler) {
                                    await prisma.scheduler.update({
                                        where: { id: scheduler.id },
                                        data: update_scheduler,
                                    });
                                }
                            }
                        } catch (error: unknown) {
                            console.error(`Failed to update schedule[${schedule.id}]: `, error);
                        }
                    }
    });
    // Meal save at regular intervals
    asyncUpdate(async function () {
        try {
            await FoodBank.instance.generate();
            console.log('Generated meal.');
        } catch (error: unknown) {
            console.error('Error generating meal:', error);
        }
    }, 3600000);
}

async function bootstrap() {
    await initialize();

    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    app.setViewEngine('ejs');
    app.setBaseViewsDir(path.join(__dirname, '..', 'views'));

    await app.listen(port);
}

void bootstrap();
