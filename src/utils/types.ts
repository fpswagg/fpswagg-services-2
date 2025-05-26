import { User } from '@supabase/supabase-js';
import { Request } from 'express';

export interface AppRequest extends Request {
    admin: boolean;
    user: User | null;
}
