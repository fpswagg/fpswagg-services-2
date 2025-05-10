import axios from "axios";

import db from "src/database";
import { RawMeal, Meal, Ingredient } from "src/types";
import { parseMeal } from "src/functions";

export default class FoodBank {
    private static _instance: FoodBank | null = null;

    public static get instance() {
        if (!this._instance)
            this._instance = new FoodBank();

        return this._instance;
    }

    async random() {
        return await themealdbRandom();
    }

    async generate() {
        let meal: Meal | null = null;
        
        for (let count = 0; count <= 100; count++) {
            meal = await this.random();

            if (!(await this.get(meal.id)))
                break;
            
            meal = null;
        }

        if (!meal)
            throw new Error("Very low available recipes.");

        return await this.push(meal);
    }
    
    async push(meal: Meal) {
        while(true) {
            const dbEquivalent = await getMealById(meal.id);
        
            const lastModified = meal.dateModified ? new Date(meal.dateModified) : undefined;
            const dbLastModified = dbEquivalent?.dateModified || undefined;

            if (dbEquivalent && lastModified?.getTime() === dbLastModified?.getTime())
                continue;

            if (dbEquivalent)
                return await updateMeal(meal.id, meal);
            else
                return await createMeal(meal);
        }
    }

    async get(id: string): Promise<Meal | null> {
        const meal = await getMealById(id);

        return meal;
    }

    async delete(id: string): Promise<Meal> {
        let meal: Meal | null = null;

        if ((meal = await this.get(id)) === null)
            throw new Error("Wrong id.");

        await deleteMeal(id);

        return meal;
    }
}

export async function themealdbRandom() {
    const response = await axios.get<{ meals: RawMeal[] }>("https://www.themealdb.com/api/json/v1/1/random.php");
    const meal = response.data.meals[0];

    return parseMeal(meal);
}

export async function createMeal(meal: Meal) {
    return await db.meal.create({
        data: {
            ...meal,
            dateModified: meal.dateModified ? new Date(meal.dateModified) : null,
            ingredients: { create: meal.ingredients }
        },
        include: { ingredients: true }
    });
} 

export async function getMealById(id: string) {
    return await db.meal.findUnique({
        where: { id },
        include: { ingredients: true },
    });
}

export async function updateMeal(id: string, meal: Omit<Partial<Meal>, "id">) {
    const { ingredients, ...mealData } = meal;

    return await db.meal.update({
        where: { id },
        data: {
            ...mealData,
            ingredients: ingredients
                ? {
                    deleteMany: {},
                    create: ingredients,
                } : undefined,
        },
        include: { ingredients: true },
    });
}

export async function deleteMeal(id: string) {
    await clearIngredients(id);
    return await db.meal.delete({ where: { id }, include: { ingredients: true } });
}

export async function createIngredient(ingredient: Ingredient, mealId: string) {
    return await db.ingredient.create({
        data: {
            ...ingredient,
            mealId,
        },
        include: { meal: true }
    });
}

export async function getIngredient(id: number) {
    return await getIngredientById(id);
}

export async function getIngredientById(id: number) {
    return await db.ingredient.findUnique({ where: { id }, include: { meal: true } });
}

export async function getIngredients(mealId: string) {
    return await getIngredientsByMealId(mealId);
}

export async function getIngredientsByMealId(mealId: string) {
    return await db.ingredient.findMany({ where: { mealId } });
}

export async function updateIngredient(id: number, data: Partial<Ingredient>) {
    return await db.ingredient.update({ where: { id }, data, include: { meal: true } });
}

export async function updateIngredients(mealId: string, data: Partial<Ingredient>) {
    return await db.ingredient.updateMany({ where: { mealId }, data });
}

export async function deleteIngredient(id: number) {
    return await db.ingredient.delete({
        where: { id }, 
        include: { meal: true },
    });
}

export async function clearIngredients(mealId?: string) {
    if (mealId === undefined)
        return await db.ingredient.deleteMany();
    else
        return await db.ingredient.deleteMany({
            where: { mealId },
        });
}