import { Controller, Get, Query, Res } from '@nestjs/common';
import { Response } from "express";

import bank from "./.";

@Controller({ path: "/food" })
export class FoodController {
    @Get("/fetch")
    async fetch(@Query('id') id: string, @Res() res: Response) {
        try {
            if (!id)
                throw new Error("No id!");

            const result = await bank.instance.get(id);

            if (!result)
                throw new Error("The meal was not found!");

            return res.status(200).json({ result });
        } catch (error: unknown) {
            console.log("Error on fetching meal:", error);
    
            return res.status(400).json({ error });
        }
    }

    @Get("/gen")
    async gen(@Res() res: Response) {
        return await genCallback(res);
    }

    @Get("/generate")
    async generate(@Res() res: Response) {
        return await genCallback(res);
    }
}

async function genCallback(res: Response) {
    try {
        return res.status(200).json({ result: await bank.instance.generate() });
    } catch (error: unknown) {
        console.log("Error on generating food:", error);

        return res.status(400).json({ error });
    }
}