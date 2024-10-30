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
export interface IChatMessage {
	fromPeer?: true;
	message: string;
}
export interface IPeerMouse {
	type: 'mousemove' | 'mouseup' | 'mousedown';
	x: number;
	y: number;
}
