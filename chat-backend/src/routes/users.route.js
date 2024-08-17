/**@import  {FastifyPluginCallback} from 'fastify'*/
import { createUser, getUsers, login, logout } from '../controllers/users.controller.js';
import { loginModel, loginResponseModel } from '../models/login.model.js';
import { userCreateModel, userResponseModel } from '../models/user.model.js';

import { $ref } from '../utils/fastifySchemas.js';
import { buildJsonSchemas } from 'fastify-zod';

/**@type {FastifyPluginCallback} */
export function userRoutes(app, _, done) {
	app.post('/login', { schema: { body: $ref('loginModel'), response: { 200: $ref('loginResponseModel') } } }, login);
	app.delete('/logout', logout);
	app.get('/users', { schema: { response: { 200: $ref('userResponseModel') } }, preHandler: [app.authenticate] }, getUsers);
	app.post('/users', { schema: { body: $ref('userCreateModel'), response: { 201: $ref('userResponseModel') } } }, createUser);

	done();
}
