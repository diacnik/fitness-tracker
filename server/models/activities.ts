import { activityKeys, type Activity } from "../types";
import data1 from "../data/activities.json"
import { PagingRequest } from "../types/dataEnvelopes";
import { connect, filterKeys, toCamelCase, toSnakeCase } from "./supabase";

export const TABLE_NAME = "activities";

type ItemType = Activity;
const data = {
    items: data1, // data1 is already the array of activities from the JSON file
}

export async function getAll(params: PagingRequest) {
    const db = connect();

    let query = db.from(TABLE_NAME).select("*", { count: "estimated"});

    if (params?.search) {
        query = query.or(`name.ilike.%${params.search}%`).or(`description.ilike.%${params.search}%`);
    }
    if (params?.sortBy) {
        query = query.order(params.sortBy, { ascending: !params.descending });
    }

    const page = params?.page ?? 1;
    const pageSize = params?.pageSize ?? 10;
    const start = (page - 1) * pageSize;
    query = query.range(start, start + pageSize - 1);

    const result = await query;

    if (result.error) {
        throw result.error;
    }

    const list = result.data.map(toCamelCase) as ItemType[];
    const count = result.count ?? 0;

    return { list, count };
}

export async function get(id: number): Promise<ItemType> {
    const db = connect();
    const result = await db.from(TABLE_NAME).select("*").eq("id", id).single();

    if (result.error) {
        throw result.error;
    }

    const item = result.data as ItemType | null;
    if (!item) {
        const error = { status: 404, message: "Activity not found" };
        throw error;
    }

    return item as ItemType;
}

export async function create(item: Exclude<ItemType, 'id'>) {
    const db = connect();
    const result = await db.from(TABLE_NAME).insert(toSnakeCase(item)).select("*").single();

    if (result.error) {
        throw result.error;
    }

    return toCamelCase(result.data) as ItemType;
}

export async function update(id: number, user: Partial<ItemType>) {
    const db = connect();
    const result = await db.from(TABLE_NAME).update(toSnakeCase(user)).eq("id", id).select("*").single();

    if (result.error) {
        throw result.error;
    }

    return toCamelCase(result.data) as ItemType;
}

export async function remove(id: number) {
    const db = connect();
    const result = await db.from(TABLE_NAME).delete().eq("id", id).select().single();
    
    if (result.error) {
        throw result.error;
    }

    return toCamelCase(result.data) as ItemType;
}

export async function seed() {
    const db = connect();
    const items = data.items.map((item) =>
        toSnakeCase(filterKeys(item, activityKeys)),
    );
    const result = await db.from(TABLE_NAME).insert(items);
    if (result.error) {
        throw result.error;
    }
    return result.count;
}