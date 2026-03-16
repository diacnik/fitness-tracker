export type User = {
	userId: number;
	profilePicture: string;
	username: string;
	firstName: string;
	lastName: string;
	isAdmin: boolean;
}

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
