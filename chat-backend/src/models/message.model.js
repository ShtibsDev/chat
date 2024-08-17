import { ObjectId } from 'mongodb';
import { z } from 'zod';

export const messageModel = z.object({
	_id: z.instanceof(ObjectId),
	text: z.string(),
	createdAt: z.date(),
	user: z.instanceof(ObjectId),
	chat: z.instanceof(ObjectId),
});

export const messageCreateModel = z.object({
	text: z.string().transform((s) => s.trim()),
	userId: z.string(),
	chatId: z.string(),
});

/**@typedef {z.infer<typeof messageCreateModel>} MessageCreateModel */
