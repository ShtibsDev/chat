import { JWT } from '@fastify/jwt';
import type { UserModel } from '../schemas/user.schema.js';

declare module 'fastify' {
	interface FastifyRequest {
		jwt: JWT;
		// user: Omit<UserModel, 'password'>;
	}

	interface FastifyInstance {
		authenticate: any;
	}
}

declare module '@fastify/jwt' {
	interface FastifyJWT {
		user: Omit<UserModel, 'password'>;
	}
}
