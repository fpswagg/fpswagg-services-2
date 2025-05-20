import { BadRequestException, Controller, Get, Query, Req, Res } from '@nestjs/common';
import { Response } from 'express';

import bank from './.';
import { AppRequest } from 'src/utils/types';

@Controller({ path: '/food' })
export class FoodController {
    @Get('/fetch')
    async fetch(@Query('id') id: string, @Req() req: AppRequest, @Res() res: Response) {
        if (!req.admin) return res.status(401).json({ error: new Error('Unauthorized!') });

        try {
            if (!id) throw new BadRequestException('No id!');

            const result = await bank.instance.get(id);

            if (!result) throw new BadRequestException('The meal was not found!');

            return res.status(200).json({ result });
        } catch (error: unknown) {
            console.log('Error on fetching meal:', error);

            return res.status(400).json({ error });
        }
    }

    @Get('/gen')
    async gen(@Req() req: AppRequest, @Res() res: Response) {
        return await genCallback(req, res);
    }

    @Get('/generate')
    async generate(@Req() req: AppRequest, @Res() res: Response) {
        return await genCallback(req, res);
    }
}

async function genCallback(req: AppRequest, res: Response) {
    if (!req.admin) return res.status(401).json({ error: new Error('Unauthorized!') });

    try {
        return res.status(200).json({ result: await bank.instance.generate() });
    } catch (error: unknown) {
        console.log('Error on generating food:', error);

        return res.status(400).json({ error });
    }
}
