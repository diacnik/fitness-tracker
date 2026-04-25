export type { DataEnvelope, DataListEnvelope } from './dataenvelopes';

export type User = {
	userId: number;
	profilePicture: string;
	username: string;
	firstName: string;
	lastName: string;
	isAdmin: boolean;
}

export const userKeys: (keyof User)[] = [
    'userId',
    'profilePicture',
    'username',
    'firstName',
    'lastName',
    'isAdmin'
]

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
