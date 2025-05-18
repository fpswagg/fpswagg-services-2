import { Controller, Get, Query, Post, Body, Res, BadRequestException } from '@nestjs/common';
import { Response } from 'express';

import bank from './.';

export class PushInput {
    number: string;
    source?: string | null;
    saved_as?: string | null;
    reason?: string | null;
    keywords?: string[];
}

export class PushPostInput {
    number: string;
    time?: string | number;
    type: string;
    destination: string;
    sender: string;
    content: Record<string, any>;
}

@Controller({ path: '/number' })
export class NumberController {
    @Get('/fetch')
    async fetch(@Query('id') id: string, @Res() res: Response) {
        try {
            if (!id) throw new BadRequestException('No id!');

            const result = await bank.instance.get(id);

            if (!result) throw new BadRequestException('The record was not found!');

            return res.status(200).json({ result });
        } catch (error: unknown) {
            console.log('Error on fetching number record:', error);

            return res.status(400).json({ error });
        }
    }

    @Post('/push')
    async push(@Body() pushData: PushInput, @Res() res: Response) {
        try {
            return res.status(200).json({
                result: await bank.instance.push(
                    pushData.number,
                    pushData.source,
                    pushData.saved_as,
                    pushData.reason,
                    ...(pushData.keywords || []),
                ),
            });
        } catch (error: unknown) {
            console.log('Error on pushing number:', error);

            return res.status(400).json({ error });
        }
    }

    @Get('/post')
    async fetchPost(@Query('id') id: string, @Res() res: Response) {
        try {
            if (!id) throw new BadRequestException('No id!');

            const parsedId = parseInt(id);

            if (isNaN(parsedId)) throw new BadRequestException('Invalid id!');

            const result = await bank.instance.getPost(parsedId);

            if (!result) throw new BadRequestException('The post was not found!');

            return res.status(200).json({ result });
        } catch (error: unknown) {
            console.log('Error on fetching number post:', error);

            return res.status(400).json({ error });
        }
    }

    @Post('/post')
    async pushPost(@Body() pushData: PushPostInput, @Res() res: Response) {
        try {
            return res.status(200).json({
                result: await bank.instance.pushPost({
                    number_id: pushData.number,
                    time: pushData.time ? new Date(pushData.time) : new Date(),
                    post_type: pushData.type,
                    destination_id: pushData.destination,
                    sender_id: pushData.sender,
                    content: pushData.content,
                }),
            });
        } catch (error: unknown) {
            console.log('Error on pushing number post:', error);

            return res.status(400).json({ error });
        }
    }
}
