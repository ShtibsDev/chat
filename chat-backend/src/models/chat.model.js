import { ObjectId } from 'mongodb';
import { messageModel } from './message.model.js';
import { z } from 'zod';

export const chatCreateModel = z.object({
	users: z.array(z.string()),
	name: z.string().optional(),
});

/** @typedef {z.infer<typeof chatCreateModel>} ChatCreateModel */

export const chatItemModel = z.object({
	_id: z.instanceof(ObjectId),
	name: z.string().nullable(),
	users: z.array(z.instanceof(ObjectId)),
	lastMessage: messageModel.nullable(),
});

/** @typedef {z.infer<typeof chatItemModel>} ChatItemModel */
