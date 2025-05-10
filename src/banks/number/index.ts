import { JsonValue } from "@prisma/client/runtime/library";

import db from "src/database";
import { NumberRecord, NumberPost } from "src/types";

export default class NumberBank {
    private static _instance: NumberBank | null = null;

    public static get instance() {
        if (!this._instance)
            this._instance = new NumberBank();

        return this._instance;
    }

    async push(number: string, source: string | null = null, saved_as: string | null = null, reason: string | null = null, ...keywords: string[]) {
        const data = { id: number, source, saved_as, reason, keywords } as NumberRecord;

        return turnRecordFromDB(await createNumber(data))!;
    }

    async get(number: string): Promise<NumberRecord | null> {
        const data = await getNumber(number);

        return turnRecordFromDB(data);
    }

    async update(number: string, updateData: Omit<Partial<NumberRecord>, "id">): Promise<NumberRecord> {
        const data = await updateNumber(number, updateData);

        if (!data)
            throw new Error("An error occured! It might be a wrong id!");

        return turnRecordFromDB(data)!;
    }

    async delete(number: string): Promise<NumberRecord> {
        let data: NumberRecord | null = null;

        if ((data = await this.get(number)) === null)
            throw new Error("Wrong id.");

        await deleteNumber(number);

        return data;
    }

    async pushPost(post: Omit<NumberPost, "id">) {
        return turnPostFromDB(await createPost(post))!;
    }

    async getPost(id: number) {
        const data = await getPostById(id);

        return turnPostFromDB(data);
    }

    async updatePost(id: number, updateData: Omit<Partial<NumberPost>, "id">): Promise<NumberPost> {
        const data = await updatePost(id, updateData);

        if (!data)
            throw new Error("An error occured! It might be a wrong id!");

        return turnPostFromDB(data)!;
    }

    async deletePost(id: number) {
        let data: NumberPost | null = null;

        if ((data = await this.getPost(id)) === null)
            throw new Error("Wrong id.");

        await deletePost(id);

        return data;
    }
}

export type NumberRecordDB = {
    id: string;
    source: string;
    keywords: string[];
    saved_as: string | null;
    reason: string | null;
    discussionFrequency: number | null;
};

export type NumberPostDB = {
    id: number;
    number_id: string;
    time: Date;
    post_type: string;
    destination_id: string;
    sender_id: string;
    content: JsonValue;
};

export function turnRecordFromDB(data: NumberRecordDB | null): NumberRecord | null {
    return data && { 
        ...data, 
        saved_as: data.saved_as || undefined, 
        reason: data.reason || undefined, 
        discussionFrequency: data.discussionFrequency ?? undefined 
    };
}

export function turnPostFromDB(data: NumberPostDB | null): NumberPost | null {
    return data && { 
        ...data, 
        content: (typeof data.content === "object" && data.content) || {},
    };
}

export async function createNumber(numberRecord: NumberRecord) {
    return await db.numberRecord.create({ data: numberRecord, include: { posts: true } });
}

export async function getNumber(id: string) {
    return await db.numberRecord.findUnique({ where: { id }, include: { posts: true } });
}

export async function updateNumber(id: string, data: Omit<Partial<NumberRecord>, "id">) {
    return await db.numberRecord.update({ where: { id }, data, include: { posts: true } });
}

export async function deleteNumber(id: string) {
    await db.numberPost.deleteMany({ where: { number_id: id } });
    await db.numberRecord.delete({ where: { id } });
}

export async function createPost(post: Omit<NumberPost, "id">) {
    return await db.numberPost.create({ data: post, include: { number: true } });
}

export async function getPost(id: number) {
    return await getPostById(id);
}

export async function getPostById(id: number) {
    return await db.numberPost.findUnique({ where: { id }, include: { number: true } });
}

export async function getPosts(number_id: string) {
    return await getPostsByNumber(number_id);
}

export async function getPostsByNumber(number_id: string) {
    return await db.numberPost.findMany({ where: { number_id }, include: { number: true } });
}

export async function updatePost(id: number, data: Omit<Partial<NumberPost>, "id">) {
    return await db.numberPost.update({ where: { id }, data, include: { number: true } });
}

export async function updatePosts(number_id: string, data: Omit<Partial<NumberPost>, "id">) {
    return await db.numberPost.updateMany({ where: { number_id }, data });
}

export async function deletePost(id: number) {
    return await db.numberPost.delete({ where: { id }, include: { number: true } });
}

export async function clearPosts(number_id?: string) {
    if (number_id === undefined)
        return await db.numberPost.deleteMany();
    else
        return await db.numberPost.deleteMany({
            where: { number_id },
        });
}
