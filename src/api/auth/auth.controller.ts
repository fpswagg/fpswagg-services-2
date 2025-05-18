import { Controller, Post, Body, Res } from '@nestjs/common';
import { Response } from 'express';

import supabase from 'src/utils/supabase';

import { adminPassword } from 'src/utils/variables';

export class UserData {
    email: string;
    password: string;
}

export class CreateUserData {
    email: string;
    password: string;
    admin_password: string;
}

export class ResetPasswordData {
    email: string;
    admin_password: string;
}

@Controller('auth')
export class AuthController {
    @Post('token')
    async generateToken(@Body() { email, password }: UserData, @Res() res: Response) {
        try {
            if (!email || !password) throw new Error('Invalid email or password.');

            const {
                data: { session },
                error,
            } = await supabase.auth.signInWithPassword({ email, password });

            if (error) throw error;

            if (!session) throw new Error('Invalid session.');

            return res.json({ token: session.access_token });
        } catch (error: unknown) {
            return res.status(401).json({ error });
        }
    }

    @Post('create-account')
    async signup(@Body() { email, password, admin_password }: CreateUserData, @Res() res: Response) {
        try {
            if (!email || !password || !admin_password) throw new Error('Invalid email, password or admin password.');

            if (admin_password !== adminPassword) throw new Error('Admin password is wrong!');

            const {
                data: { user },
                error,
            } = await supabase.auth.signUp({ email, password });

            if (error) throw error;

            return res.json({ success: true, need_email_confirmation: !user?.confirmed_at, user });
        } catch (error: unknown) {
            return res.status(401).json({ success: false, error });
        }
    }

    @Post('reset-password')
    async resetPass(@Body() { email, admin_password }: ResetPasswordData, @Res() res: Response) {
        try {
            if (!email || !admin_password) throw new Error('Invalid email or admin password.');

            if (admin_password !== adminPassword) throw new Error('Admin password is wrong!');

            const { error } = await supabase.auth.resetPasswordForEmail(email);

            if (error) throw error;

            return res.json({ success: true, email });
        } catch (error: unknown) {
            return res.status(401).json({ success: false, error });
        }
    }
}
