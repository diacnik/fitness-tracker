import { connectionKeys, type Connection } from "../types";
import data1 from "../data/connections.json";
import { PagingRequest } from "../types/dataEnvelopes";
import { connect, filterKeys, toCamelCase, toSnakeCase } from "./supabase";

export const TABLE_NAME = "connections";

type ItemType = Connection;
const data = {
    items: data1,
};

/**
 * Get all connections (Admin view or debugging)
 */
export async function getAll(params: PagingRequest) {
    const db = connect();
    let query = db.from(TABLE_NAME).select("*", { count: "estimated" });

    if (params?.sortBy) {
        query = query.order(params.sortBy, { ascending: !params.descending });
    }

    const page = params?.page ?? 1;
    const pageSize = params?.pageSize ?? 10;
    const start = (page - 1) * pageSize;
    query = query.range(start, start + pageSize - 1);

    const result = await query;

    if (result.error) throw result.error;

    return {
        list: result.data.map(toCamelCase) as ItemType[],
        count: result.count ?? 0,
    };
}

/**
 * Specific helper to get friends for a specific user
 * This looks in both user_id and friend_id columns
 */
export async function getForUser(userId: number) {
    const db = connect();
    // Logic: find where current user is the initiator OR the recipient
    const result = await db
        .from(TABLE_NAME)
        .select(`
            *,
            users!connections_user_id_fkey (id, username, first_name, last_name, profile_picture),
            friend:users!connections_friend_id_fkey (id, username, first_name, last_name, profile_picture)
        `)
        .or(`user_id.eq.${userId},friend_id.eq.${userId}`);

    if (result.error) throw result.error;

    return result.data.map(toCamelCase);
}

export async function get(id: number): Promise<ItemType> {
    const db = connect();
    const result = await db.from(TABLE_NAME).select("*").eq("id", id).single();

    if (result.error) {
        throw { status: 404, message: "Connection not found" };
    }

    return toCamelCase(result.data) as ItemType;
}

export async function create(item: Exclude<ItemType, 'id'>) {
    const db = connect();
    const result = await db.from(TABLE_NAME).insert(toSnakeCase(item)).select("*").single();

    if (result.error) throw result.error;

    return toCamelCase(result.data) as ItemType;
}

export async function update(id: number, connection: Partial<ItemType>) {
    const db = connect();
    const result = await db.from(TABLE_NAME).update(toSnakeCase(connection)).eq("id", id).select("*").single();

    if (result.error) throw result.error;

    return toCamelCase(result.data) as ItemType;
}

export async function remove(id: number) {
    const db = connect();
    const result = await db.from(TABLE_NAME).delete().eq("id", id).select().single();
    
    if (result.error) throw result.error;

    return toCamelCase(result.data) as ItemType;
}

export async function seed() {
    const db = connect();
    const result = await db.from(TABLE_NAME).insert(data.items).select(); // formatting is already snake_case in the JSON file

    if (result.error) throw result.error;

    return result.count;
}