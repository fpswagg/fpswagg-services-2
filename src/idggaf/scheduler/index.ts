import { JsonValue } from "@prisma/client/runtime/library";

import db from "src/database";
import { Scheduler as IScheduler, Schedule as ISchedule } from "src/types";

export interface ScheduleFromDB {
    id: number;
    schedulerId: string;
    creationTime: Date;
    toPostAt: Date;
    posted: boolean;
    webhook: string | null;
    content: string;
    details: JsonValue;
};

export interface SchedulerFromDB {
    id: string;
    detailedName: string;
    schedules: ScheduleFromDB[];
};

export class Schedule implements ISchedule {
    private _id: number;
    private _creationTime?: Date;
    private _toPostAt?: Date;
    private _posted?: boolean;
    private _webhook?: string;
    private _content?: string;
    private _details?: Record<string, any>;

    private _initPromise?: Promise<void>;
    private _initialized: boolean;
    private _error?: Error;

    private _pendingPromises: Promise<any>[];

    constructor(data: number | ScheduleFromDB) {
        if (typeof data === "number") {
            this._id = data;
            this._initialized = false;

            this._initPromise = this._initialize();
        } else {
            this._id = data.id;
            this._load(data);
        }
        
        this._pendingPromises = [];
    }

    private async _initialize() {
        try {
            const data = await db.schedule.findUnique({ where: { id: this._id } });

            if (!data)
                throw new Error("The schedule does not exist!");

            this._load(data);
        } catch (error) {
            this._error = error as Error;
        }
    }

    private _load(data: ScheduleFromDB) {
        this._creationTime = data.creationTime;
        this._toPostAt = data.toPostAt;
        this._posted = data.posted;
        this._webhook = data.webhook || undefined;
        this._content = data.content;
        this._details = data.details as Record<string, any>;
        
        this._initialized = true;
    }

    private _notInitedError() {
        if (this._error)
            throw this._error;
        else
            throw new Error("The schedule was not initialized!");
    }

    public async wait<T = any>() {
        const all = await Promise.all(this._pendingPromises);

        this._pendingPromises = [];

        return all as T[];
    }

    public async reload() {
        this._initialized = false;
        await this._initialize();
        return this;
    }

    public async update<T extends keyof Omit<ScheduleFromDB, 'id'>>(key: T, value: ScheduleFromDB[T]) {
        return await db.schedule.update({ where: { id: this._id }, data: { [key]: value } });
    }

    public async delete() {
        await db.schedule.delete({ where: { id: this._id } });

        return this;
    }

    public get initPromise() {
        return this._initPromise;
    }

    public get initialized() {
        return this._initialized;
    }

    public get error() {
        return this._error;
    }

    public get id() {
        return this._id;
    }

    public get creationTime() {
        if (!this._initialized)
            this._notInitedError();

        return this._creationTime!;
    }

    public set creationTime(creationTime: Date) {
        if (!this._initialized)
            this._notInitedError();

        this._pendingPromises.push((
            async () => {
                await this.update("creationTime", creationTime);

                this._creationTime = creationTime;
            }
        )());
    }

    public get toPostAt() {
        if (!this._initialized)
            this._notInitedError();

        return this._toPostAt!;
    }

    public set toPostAt(toPostAt: Date) {
        if (!this._initialized)
            this._notInitedError();

        this._pendingPromises.push((
            async () => {
                await this.update("toPostAt", toPostAt);

                this._toPostAt = toPostAt;
            }
        )());
    }

    public get posted() {
        if (!this._initialized)
            this._notInitedError();

        return this._posted!;
    }

    public set posted(posted: boolean) {
        if (!this._initialized)
            this._notInitedError();

        this._pendingPromises.push((
            async () => {
                await this.update("posted", posted);

                this._posted = posted;
            }
        )());
    }

    public get webhook() {
        if (!this._initialized)
            this._notInitedError();

        return this._webhook;
    }

    public set webhook(webhook: string | undefined) {
        if (!this._initialized)
            this._notInitedError();

        this._pendingPromises.push((
            async () => {
                await this.update("webhook", webhook || null);

                this._webhook = webhook || undefined;
            }
        )());
    }

    public get content() {
        if (!this._initialized)
            this._notInitedError();

        return this._content!;
    }

    public set content(content: string) {
        if (!this._initialized)
            this._notInitedError();

        this._pendingPromises.push((
            async () => {
                await this.update("content", content);

                this._content = content;
            }
        )());
    }

    public get details() {
        if (!this._initialized)
            this._notInitedError();

        return this._details!;
    }

    public set details(details: Record<string, any>) {
        if (!this._initialized)
            this._notInitedError();

        this._pendingPromises.push((
            async () => {
                await this.update("details", details);

                this._details = details;
            }
        )());
    }

    public static async load(id: number) {
        const schedule = new Schedule(id);

        await schedule.initPromise!;

        return schedule;
    }

    public static async make(scheduler: Scheduler, toPostAt: Date, content: string, webhook: string | null = null, details: Record<string, any> = {}) {
        const data = await db.schedule.create({ data: { schedulerId: scheduler.id, toPostAt, content, webhook, details } });
        const schedule = new Schedule(data);

        scheduler.pushSchedules(schedule);

        return schedule;
    }
}

export class Scheduler implements IScheduler {
    private _id: string;
    private _detailedName?: string;
    private _schedules?: Schedule[];

    private _initPromise?: Promise<void>;
    private _initialized: boolean;
    private _error: Error;

    private _pendingPromises: Promise<any>[];

    constructor(data: string | SchedulerFromDB) {
        if (typeof data === "string") {
            this._id = data;

            this._initialized = false;
            this._initPromise = this._initialize();
        } else {
            this._id = data.id;
            this._load(data);
        }

        this._pendingPromises = [];
    }

    public async wait<T = any>() {
        const all = await Promise.all(this._pendingPromises);

        this._pendingPromises = [];

        return all as T[];
    }

    public async reload() {
        this._initialized = false;
        await this._initialize();
        return this;
    }

    public async update<T extends keyof Omit<SchedulerFromDB, 'id'>>(key: T, value: SchedulerFromDB[T]) {
        return await db.scheduler.update({ where: { id: this._id }, data: { [key]: value }});
    }

    public async delete() {
        this._schedules = await Promise.all(this.schedules.map(schedule => schedule.delete()));

        await db.scheduler.delete({ where: { id: this._id } });

        return this;
    }

    private async _initialize() {
        try {
            const data = await db.scheduler.findUnique({ where: { id: this._id }, include: { schedules: true } });

            if (!data)
                throw new Error("The scheduler does not exist!");

            this._load(data);
        } catch (error) {
            this._error = error as Error;
        }
    }

    private _load(data: SchedulerFromDB) {
        this._detailedName = data.detailedName;
        this._schedules = data.schedules.map(data => new Schedule(data));
        
        this._initialized = true;
    }

    private _notInitedError() {
        if (this._error)
            throw this._error;
        else
            throw new Error("The scheduler was not initialized!");
    }

    public get initPromise() {
        return this._initPromise;
    }

    public get initialized() {
        return this._initialized;
    }

    public get error() {
        return this._error;
    }

    public get id() {
        return this._id;
    }

    public get detailedName() {
        if (!this._initialized)
            this._notInitedError();

        return this._detailedName!;
    }

    public set detailedName(detailedName: string) {
        if (!this._initialized)
            this._notInitedError();

        this._pendingPromises.push((
            async () => {
                await this.update("detailedName", detailedName);

                this._detailedName = detailedName;
            }
        )());
    }

    public get schedules() {
        if (!this._initialized)
            this._notInitedError();

        return [...this._schedules!];
    }

    public async makeSchedule(toPostAt: Date, content: string, webhook: string | null = null, details: Record<string, any> = {}) {
        return await Schedule.make(this, toPostAt, content, webhook, details);
    }

    public pushSchedules(schedule: Schedule) {
        if (!this._initialized)
            this._notInitedError();

        return this._schedules!.push(schedule);
    }

    public static async load(id: string) {
        const scheduler = new Scheduler(id);

        await scheduler.initPromise!;

        return scheduler;
    }

    public static async make(id: string, detailedName: string) {
        const data = await db.scheduler.create({ data: { id, detailedName }, include: { schedules: true } });
        const scheduler = new Scheduler(data);

        return scheduler;
    }
}

export default Scheduler;