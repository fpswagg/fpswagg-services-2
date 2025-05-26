import { Injectable, NestMiddleware } from '@nestjs/common';
import { Response, NextFunction } from 'express';

import supabase from 'src/utils/supabase';

import { AppRequest } from 'src/utils/types';
import { adminPassword } from 'src/utils/variables';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    async use(req: AppRequest, res: Response, next: NextFunction) {
        console.log(`[${req.method}] ${req.originalUrl}`);

        req.admin = false;
        req.user = null;

        const authHeader = req.headers['authorization'] || req.headers['Authorization'];

        const bearerToken =
            typeof authHeader === 'string'
                ? authHeader.startsWith('Bearer ')
                    ? authHeader.slice(7)
                    : (authHeader.startsWith('Admin ') && authHeader.slice(6) === adminPassword) || null
                : null;

        if (bearerToken === true) {
            req.admin = true;
        } else if (bearerToken)
            try {
                const { data, error } = await supabase.auth.getUser(bearerToken);

                if (error || !data?.user) return res.status(401).send('Invalid or expired token.');

                req.user = data.user;
                req.admin = false;

                // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (error: unknown) {
                return res.status(401).send('Authentication failed.');
            }
        else return res.status(401).send('Invalid bearer token.');

        next();
    }
}
