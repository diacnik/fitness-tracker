export type { DataEnvelope, DataListEnvelope } from "./dataEnvelopes";

export type UserRole = 'admin' | 'user';

export type User = {
	id: number;
	profilePicture: string;
	username: string;
	firstName: string;
	lastName: string;
    email: string;
	role: UserRole;
}

export const userKeys: (keyof User)[] = [
    'id',
    'profilePicture',
    'username',
    'firstName',
    'lastName',
    'email',
    'role'
]

export type Connection = {
    id: number;
    userId: number;
    friendId: number;
}

export const connectionKeys: (keyof Connection)[] = [
    'id',
    'userId',
    'friendId'
];

export type ActivityCategory = 'run' | 'climb' | 'bike' | 'other' | 'hike';

export type Activity = {
	id: number;
	userId: number;
	date: string;
	time: string;
	description: string;
	category: ActivityCategory;
	distance: number;
	duration: number;
	image: string;
}

export const activityKeys: (keyof Activity)[] = [
    'id',
    'userId',
    'date',
    'time',
    'description',
    'category',
    'distance',
    'duration',
    'image'
]
