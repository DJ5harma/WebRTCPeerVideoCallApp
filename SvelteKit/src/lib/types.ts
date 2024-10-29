export interface OUser {
	username: string;
	email: string;
	_id: string;
	createdAt: Date;
	updatedAt: Date;
}
export interface IUser extends OUser {
	friends: OUser[];
}
