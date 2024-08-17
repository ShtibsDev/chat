import { z } from 'zod';

export const loginModel = z.object({
	email: z
		.string({
			required_error: 'Email is required',
			invalid_type_error: 'Email must be a string',
		})
		.email(),
	password: z.string().min(6),
});

/**@typedef {z.infer<typeof loginModel>} LoginModel	 */

export const loginResponseModel = z.object({ accessToken: z.string() });
