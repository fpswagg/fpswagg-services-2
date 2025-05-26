import { NumberRecord, NumberPost } from '@fpswagg/my-database/types';
import {
    turnRecordFromDB,
    createNumber,
    getNumber,
    updateNumber,
    deleteNumber,
    createPost,
    getPostById,
    turnPostFromDB,
    updatePost,
    deletePost,
} from '@fpswagg/my-database/functions';

export default class NumberBank {
    private static _instance: NumberBank | null = null;

    public static get instance() {
        if (!this._instance) this._instance = new NumberBank();

        return this._instance;
    }

    async push(
        number: string,
        source: string | null = null,
        saved_as: string | null = null,
        reason: string | null = null,
        ...keywords: string[]
    ) {
        const data = { id: number, source, saved_as, reason, keywords } as NumberRecord;

        return turnRecordFromDB(await createNumber(data))!;
    }

    async get(number: string): Promise<NumberRecord | null> {
        const data = await getNumber(number);

        return turnRecordFromDB(data);
    }

    async update(number: string, updateData: Omit<Partial<NumberRecord>, 'id'>): Promise<NumberRecord> {
        const data = await updateNumber(number, updateData);

        if (!data) throw new Error('An error occured! It might be a wrong id!');

        return turnRecordFromDB(data)!;
    }

    async delete(number: string): Promise<NumberRecord> {
        let data: NumberRecord | null = null;

        if ((data = await this.get(number)) === null) throw new Error('Wrong id.');

        await deleteNumber(number);

        return data;
    }

    async pushPost(post: Omit<NumberPost, 'id'>) {
        return turnPostFromDB(await createPost(post))!;
    }

    async getPost(id: number) {
        const data = await getPostById(id);

        return turnPostFromDB(data);
    }

    async updatePost(id: number, updateData: Omit<Partial<NumberPost>, 'id'>): Promise<NumberPost> {
        const data = await updatePost(id, updateData);

        if (!data) throw new Error('An error occured! It might be a wrong id!');

        return turnPostFromDB(data)!;
    }

    async deletePost(id: number) {
        let data: NumberPost | null = null;

        if ((data = await this.getPost(id)) === null) throw new Error('Wrong id.');

        await deletePost(id);

        return data;
    }
}
