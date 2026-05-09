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

// A user who is currently connected to the logged in user
export type ConnectedUser = User & {
    connectionId: number;
}

export const userKeys: (keyof User)[] = [
    'profilePicture',
    'username',
    'firstName',
    'lastName',
    'email',
    'role'
]

export type ConnectionStatus = 'pending' | 'accepted' | 'blocked';

export type Connection = {
    id: number;
    userLowId: number;
    userHighId: number;
    requestedBy: number;
    status: ConnectionStatus;
}

export const connectionKeys: (keyof Connection)[] = [
    'id',
    'userLowId',
    'userHighId',
    'requestedBy',
    'status'
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
    'userId',
    'date',
    'time',
    'description',
    'category',
    'distance',
    'duration',
    'image'
]
