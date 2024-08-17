import { z } from 'zod';
type User = {
	_id: string;
	name: string;
	email: string;
};

export const userSchema = z.object({
	name: z
		.string()
		.min(3)
		.max(50)
		.transform((n) => n.trim()),
	email: z
		.string()
		.email()
		.transform((e) => e.trim().toLowerCase()),
});

export type UserCreateModel = z.infer<typeof userSchema>;

export default User;
