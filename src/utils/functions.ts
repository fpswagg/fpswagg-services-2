import path from 'path';
import db from '@fpswagg/my-database';

import {
    UserMetadata,
    UserMetadataFromDB,
    Service,
    ServiceFromDB,
    Testimonial,
    Ingredient,
    Meal,
    NumberPost,
    NumberPostDB,
    NumberRecord,
    NumberRecordDB,
    RawMeal,
} from '@fpswagg/my-database/types';

// UserMetadata converters
export function turnUserMetadataFromDB(data: UserMetadataFromDB | null): UserMetadata | null {
    return (
        data && {
            ...data,
            data: typeof data.data === 'object' && data.data !== null ? data.data : {},
        }
    );
}

// Service converters
export function turnServiceFromDB(data: ServiceFromDB | null): Service | null {
    return (
        data && {
            ...data,
            metadata: typeof data.metadata === 'object' && data.metadata !== null ? data.metadata : {},
        }
    );
}

// UserMetadata CRUD
export async function createUserMetadata(user: UserMetadata) {
    return await db.userMetadata.create({
        data: user,
    });
}

export async function getUserMetadata(uid: string) {
    const data = await db.userMetadata.findUnique({ where: { uid } });
    return turnUserMetadataFromDB(data);
}

export async function updateUserMetadata(uid: string, data: Omit<Partial<UserMetadata>, 'uid'>) {
    const updated = await db.userMetadata.update({
        where: { uid },
        data,
    });
    return turnUserMetadataFromDB(updated);
}

export async function deleteUserMetadata(uid: string) {
    return await db.userMetadata.delete({ where: { uid } });
}

// Service CRUD
export async function createService(service: Omit<Service, 'id' | 'createdAt' | 'updatedAt'>) {
    const created = await db.service.create({
        data: service,
    });
    return turnServiceFromDB(created);
}

export async function getService(id: number) {
    const data = await db.service.findUnique({ where: { id } });
    return turnServiceFromDB(data);
}

export async function getServices() {
    const data = await db.service.findMany();
    return data.map(turnServiceFromDB).filter(Boolean) as Service[];
}

export async function updateService(id: number, data: Omit<Partial<Service>, 'id' | 'createdAt' | 'updatedAt'>) {
    const updated = await db.service.update({
        where: { id },
        data,
    });
    return turnServiceFromDB(updated);
}

export async function deleteService(id: number) {
    return await db.service.delete({ where: { id } });
}

// Testimonial CRUD
export async function createTestimonial(testimonial: Omit<Testimonial, 'id' | 'createdAt' | 'updatedAt'>) {
    return await db.testimonial.create({
        data: testimonial,
    });
}

export async function getTestimonial(id: number) {
    return await db.testimonial.findUnique({ where: { id } });
}

export async function getTestimonials() {
    return await db.testimonial.findMany();
}

export async function updateTestimonial(
    id: number,
    data: Omit<Partial<Testimonial>, 'id' | 'createdAt' | 'updatedAt'>,
) {
    return await db.testimonial.update({
        where: { id },
        data,
    });
}

export async function deleteTestimonial(id: number) {
    return await db.testimonial.delete({ where: { id } });
}

export function turnRecordFromDB(data: NumberRecordDB | null): NumberRecord | null {
    return (
        data && {
            ...data,
            saved_as: data.saved_as || undefined,
            reason: data.reason || undefined,
            discussionFrequency: data.discussionFrequency ?? undefined,
        }
    );
}

export function turnPostFromDB(data: NumberPostDB | null): NumberPost | null {
    return (
        data && {
            ...data,
            content: (typeof data.content === 'object' && data.content) || {},
        }
    );
}

export async function createNumber(numberRecord: NumberRecord) {
    return await db.numberRecord.create({
        data: numberRecord,
        include: { posts: true },
    });
}

export async function getNumber(id: string) {
    return await db.numberRecord.findUnique({
        where: { id },
        include: { posts: true },
    });
}

export async function updateNumber(id: string, data: Omit<Partial<NumberRecord>, 'id'>) {
    return await db.numberRecord.update({
        where: { id },
        data,
        include: { posts: true },
    });
}

export async function deleteNumber(id: string) {
    await db.numberPost.deleteMany({ where: { number_id: id } });
    await db.numberRecord.delete({ where: { id } });
}

export async function createPost(post: Omit<NumberPost, 'id'>) {
    return await db.numberPost.create({
        data: post,
        include: { number: true },
    });
}

export async function getPost(id: number) {
    return await getPostById(id);
}

export async function getPostById(id: number) {
    return await db.numberPost.findUnique({
        where: { id },
        include: { number: true },
    });
}

export async function getPosts(number_id: string) {
    return await getPostsByNumber(number_id);
}

export async function getPostsByNumber(number_id: string) {
    return await db.numberPost.findMany({
        where: { number_id },
        include: { number: true },
    });
}

export async function updatePost(id: number, data: Omit<Partial<NumberPost>, 'id'>) {
    return await db.numberPost.update({
        where: { id },
        data,
        include: { number: true },
    });
}

export async function updatePosts(number_id: string, data: Omit<Partial<NumberPost>, 'id'>) {
    return await db.numberPost.updateMany({ where: { number_id }, data });
}

export async function deletePost(id: number) {
    return await db.numberPost.delete({
        where: { id },
        include: { number: true },
    });
}

export async function clearPosts(number_id?: string) {
    if (number_id === undefined) return await db.numberPost.deleteMany();
    else
        return await db.numberPost.deleteMany({
            where: { number_id },
        });
}

export async function createMeal(meal: Meal) {
    return await db.meal.create({
        data: {
            ...meal,
            dateModified: meal.dateModified ? new Date(meal.dateModified) : null,
            ingredients: { create: meal.ingredients },
        },
        include: { ingredients: true },
    });
}

export async function getMealById(id: string) {
    return await db.meal.findUnique({
        where: { id },
        include: { ingredients: true },
    });
}

export async function updateMeal(id: string, meal: Omit<Partial<Meal>, 'id'>) {
    const { ingredients, ...mealData } = meal;

    return await db.meal.update({
        where: { id },
        data: {
            ...mealData,
            ingredients: ingredients
                ? {
                      deleteMany: {},
                      create: ingredients,
                  }
                : undefined,
        },
        include: { ingredients: true },
    });
}

export async function deleteMeal(id: string) {
    await clearIngredients(id);
    return await db.meal.delete({
        where: { id },
        include: { ingredients: true },
    });
}

export async function createIngredient(ingredient: Ingredient, mealId: string) {
    return await db.ingredient.create({
        data: {
            ...ingredient,
            mealId,
        },
        include: { meal: true },
    });
}

export async function getIngredient(id: number) {
    return await getIngredientById(id);
}

export async function getIngredientById(id: number) {
    return await db.ingredient.findUnique({
        where: { id },
        include: { meal: true },
    });
}

export async function getIngredients(mealId: string) {
    return await getIngredientsByMealId(mealId);
}

export async function getIngredientsByMealId(mealId: string) {
    return await db.ingredient.findMany({ where: { mealId } });
}

export async function updateIngredient(id: number, data: Partial<Ingredient>) {
    return await db.ingredient.update({
        where: { id },
        data,
        include: { meal: true },
    });
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
    if (mealId === undefined) return await db.ingredient.deleteMany();
    else
        return await db.ingredient.deleteMany({
            where: { mealId },
        });
}

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
