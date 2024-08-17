/**@import {Model, Types} from 'mongoose'*/
import { Schema, model } from 'mongoose';

/**@typedef {{text:string, createdAt: Date, user: string, chat: string}} MessageModel */
/**@typedef {{name: string | null, messages: MessageModel[], users: Types.ObjectId[]}} ChatModel */

/**@type Schema<ChatModel> */
const ChatSchema = new Schema({
	name: { type: String, required: false },
	messages: [
		{
			text: { type: String, required: true, trim: true },
			user: {
				type: Schema.Types.ObjectId,
				ref: 'users',
				required: true,
			},
			chat: {
				type: Schema.Types.ObjectId,
				// ref: 'chats',
				required: true,
			},
			createdAt: {
				type: Date,
				default: Date.now,
			},
		},
	],
	users: [
		{
			type: Schema.Types.ObjectId,
			ref: 'users',
		},
	],
});

/**@type {Model<ChatModel>} */
export const Chat = model('chats', ChatSchema);
