import { chatRoutes } from './routes/chats.route.js';
import { clients } from './utils/wsClients.js';
import cookie from '@fastify/cookie';
import cors from '@fastify/cors';
import fastify from 'fastify';
import getLocalIp from './utils/getLocalIp.js';

import jwt from '@fastify/jwt';
import mongoose from 'mongoose';
import { schemas } from './utils/fastifySchemas.js';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import { userRoutes } from './routes/users.route.js';
import websocket from '@fastify/websocket';
import { getUserByEmail } from './controllers/users.controller.js';

const ipAddress = getLocalIp();
const SECRET = 'mySuperSecretSecret';

const app = fastify({ logger: true });
app.register(jwt, { secret: SECRET });
app.register(cookie, { secret: SECRET, hook: 'preHandler' });
app.register(websocket);
app.register(cors, { origin: ['http://localhost:5173', `http://${ipAddress}:5173`] });

await app.register(swagger);
await app.register(swaggerUi, {
	routePrefix: '/documentation',
	uiConfig: {
		docExpansion: 'full',
		deepLinking: false,
	},
	uiHooks: {
		onRequest: (_request, _reply, next) => next(),
		preHandler: (_request, _reply, next) => next(),
	},
	staticCSP: true,
	transformStaticCSP: (header) => header,
	transformSpecification: (swaggerObject) => swaggerObject,
	transformSpecificationClone: true,
});

app.addHook('preHandler', (req, _res, next) => {
	req.jwt = app.jwt;
	return next();
});
app.register(async function (fastify) {
	fastify.get('/ws/:email', { websocket: true }, async (socket, req) => {
		const { email } = /**@type {{email: string}}*/ (req.params);
		const user = await getUserByEmail(email);
		if (!user) {
			socket.send('User not found');
			return socket.close();
		}

		clients.set(user._id.toString(), socket);

		socket.on('close', () => {
			clients.delete(user._id);
		});

		socket.on('message', (message) => {
			socket.send('hi from server');
		});
	});
});

app.decorate('authenticate', authenticate);

/**
 * @param {import('fastify').FastifyRequest} req
 * @param {import('fastify').FastifyReply} res
 */
async function authenticate(req, res) {
	let token = req.headers['authorization'];

	if (!token) return res.code(401).send({ message: 'Unauthorized' });

	token = token.substring('Bearer '.length);
	/**@type {import('./schemas/user.schema.js').UserModel} */
	const decoded = req.jwt.verify(token);
	req.user = decoded;
}

schemas.forEach((schema) => app.addSchema(schema));
app.register(userRoutes);
app.register(chatRoutes, { prefix: '/chats' });

app.get('/health', () => ({ status: 'UP' }));

try {
	await mongoose.connect('mongodb://localhost:27017/chat-demo');
	app.listen({ port: 3001 }, () => console.log('Web server is running'));
} catch (error) {
	console.error('Server crushed', error);
}
