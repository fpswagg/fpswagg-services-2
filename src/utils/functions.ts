import path from 'path';

import { Meal, RawMeal } from './types';

export function parseMeal(rawMeal: RawMeal): Meal {
    const ingredients: { ingredient: string; measure: string }[] = [];

    for (let i = 1; i <= 20; i++) {
        const ingredient = rawMeal[`strIngredient${i}` as keyof RawMeal];
        const measure = rawMeal[`strMeasure${i}` as keyof RawMeal];

        if (ingredient && measure) {
            ingredients.push({ ingredient, measure });
        }
    }

    const meal = {
        id: rawMeal.idMeal,
        name: rawMeal.strMeal,
        category: rawMeal.strCategory,
        area: rawMeal.strArea,
        instructions: rawMeal.strInstructions,
        thumbnail: rawMeal.strMealThumb,
        tags: rawMeal.strTags ? rawMeal.strTags.split(',') : [],
        youtube: rawMeal.strYoutube,
        ingredients,
        source: rawMeal.strSource,
        imageSource: rawMeal.strImageSource,
        creativeCommonsConfirmed: rawMeal.strCreativeCommonsConfirmed,
        dateModified: typeof rawMeal.dateModified === 'string' ? new Date(rawMeal.dateModified) : null,
    };

    return meal;
}

export function seconds(n = 1) {
    return n * 1000;
}

export function minutes(n = 1) {
    return n * seconds(60);
}

export function hours(n = 1) {
    return n * minutes(60);
}

export function days(n = 1) {
    return n * hours(24);
}

export const wait = (time = 1000) => new Promise((resolve) => setTimeout(resolve, time));

export function anyfy<T>(value: T) {
    return JSON.parse(JSON.stringify(value)) as T;
}

export function chance(value: number) {
    if (value > 1 || value < 0) throw new Error('The value is out of range!');

    if (value > Math.random()) return true;
    else return false;
}

export function getFileNameFromURL(url: string, flag = false): string | null {
    try {
        return path.basename(new URL(url).pathname);
    } catch (error) {
        if (flag) throw error;
        else return null;
    }
}
