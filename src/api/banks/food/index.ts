import axios from 'axios';

import { RawMeal, Meal } from '@fpswagg/my-database/types';
import { createMeal, deleteMeal, getMealById, parseMeal, updateMeal } from '@fpswagg/my-database/functions';

export default class FoodBank {
    private static _instance: FoodBank | null = null;

    public static get instance() {
        if (!this._instance) this._instance = new FoodBank();

        return this._instance;
    }

    async random() {
        return await themealdbRandom();
    }

    async generate() {
        let meal: Meal | null = null;

        for (let count = 0; count <= 100; count++) {
            meal = await this.random();

            if (!(await this.get(meal.id))) break;

            meal = null;
        }

        if (!meal) throw new Error('Very low available recipes.');

        return await this.push(meal);
    }

    async push(meal: Meal) {
        while (true) {
            const dbEquivalent = await getMealById(meal.id);

            const lastModified = meal.dateModified ? new Date(meal.dateModified) : undefined;
            const dbLastModified = dbEquivalent?.dateModified || undefined;

            if (dbEquivalent && lastModified?.getTime() === dbLastModified?.getTime()) continue;

            if (dbEquivalent) return await updateMeal(meal.id, meal);
            else return await createMeal(meal);
        }
    }

    async get(id: string): Promise<Meal | null> {
        const meal = await getMealById(id);

        return meal;
    }

    async delete(id: string): Promise<Meal> {
        let meal: Meal | null = null;

        if ((meal = await this.get(id)) === null) throw new Error('Wrong id.');

        await deleteMeal(id);

        return meal;
    }
}

export async function themealdbRandom() {
    const response = await axios.get<{ meals: RawMeal[] }>('https://www.themealdb.com/api/json/v1/1/random.php');
    const meal = response.data.meals[0];

    return parseMeal(meal);
}
