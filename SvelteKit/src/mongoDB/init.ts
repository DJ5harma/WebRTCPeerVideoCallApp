import mongoose from 'mongoose';
import { MONGO_URI } from '$env/static/private';
import USER from './models/USER.MODEL';

let isConnected = false;

export default async function dbConnect() {
	if (isConnected) return;

	try {
		if (!MONGO_URI) throw new Error('MONGO_URI not detected');
		const db = await mongoose.connect(MONGO_URI);

		if (!mongoose.models.USER) mongoose.model('USER', USER.schema);

		isConnected = db.connections[0].readyState === 1;
	} catch (error) {
		console.error('Could not connect to MongoDB', error);
	}
}
