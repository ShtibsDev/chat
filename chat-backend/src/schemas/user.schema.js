/**@import {Model, Types} from 'mongoose'*/
import { Schema, model } from 'mongoose';

/**@typedef {{_id: string, name: string; email: string, password: string; chats: Types.ObjectId[]}} UserModel */

/**@type {Schema<UserModel>} */
const UserSchema = new Schema({
	name: { type: String, required: true },
	email: {
		type: String,
		required: true,
		unique: true,
		trim: true,
	},
	password: {
		type: String,
		required: true,
	},
	chats: [
		{
			type: Schema.Types.ObjectId,
			ref: 'chats',
			default: [],
		},
	],
});

/** @type {Model<UserModel>} */
export const User = model('users', UserSchema);
