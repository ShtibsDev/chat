import { ObjectId } from 'mongodb';
import { z } from 'zod';

export const userCreateModel = z.object({
	name: z.string().transform((n) => n.trim()),
	password: z.string().min(8),
	email: z
		.string()
		.email()
		.transform((e) => e.trim().toLowerCase()),
});

/**@typedef {z.infer<typeof userCreateModel>} UserCreateModel	 */

export const userResponseModel = z.array(
	z.object({
		_id: z.instanceof(ObjectId),
		name: z.string(),
		email: z.string(),
	})
);
