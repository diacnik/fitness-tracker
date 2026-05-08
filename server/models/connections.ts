import { type Connection, type User } from "../types";
import data1 from "../data/connections.json";
import { PagingRequest } from "../types/dataEnvelopes";
import { connect, toCamelCase, toSnakeCase } from "./supabase";

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

export async function getUserConnections(userId: number): Promise<User[]> {
    const db = connect();
    const results = await db
        .from(TABLE_NAME)
        .select(`
            user_low_id,
            user_high_id,
            userLow:users!connections_user_low_id_fkey (
                id,
                username,
                first_name,
                last_name,
                profile_picture,
                email,
                role
            ),
            userHigh:users!connections_user_high_id_fkey (
                id,
                username,
                first_name,
                last_name,
                profile_picture,
                email,
                role
            )
        `)
        .or(`user_low_id.eq.${userId},user_high_id.eq.${userId}`)
        .eq("status", "accepted");

    if (results.error) throw results.error;

    const users = (results.data ?? []).map((row: any) => {
        const other = row.user_low_id === userId ? row.userHigh : row.userLow;
        return other ? (toCamelCase(other) as User) : null;
    });

    return users.filter((user): user is User => user !== null);
}

export async function get(id: number): Promise<ItemType> {
    const db = connect();
    const result = await db.from(TABLE_NAME).select("*").eq("id", id).single();

    if (result.error) {
        throw { status: 404, message: "Connection not found" };
    }

    return toCamelCase(result.data) as ItemType;
}

export async function create(item: Omit<ItemType, 'id'>) {
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