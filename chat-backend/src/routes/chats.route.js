/**@import  {FastifyPluginCallback} from 'fastify'*/

import { chatCreateModel, chatItemModel } from '../models/chat.model.js';
import { createChat, getChats, getMessages, sendMessage } from '../controllers/chats.controller.js';

import { $ref } from '../utils/fastifySchemas.js';
import { buildJsonSchemas } from 'fastify-zod';
import { z } from 'zod';

/**@type {FastifyPluginCallback} */
export function chatRoutes(app, _, done) {
	app.get('', { schema: { response: { 200: $ref('chatItemsModel') } }, preHandler: [app.authenticate] }, getChats);
	app.post('', { schema: { body: $ref('chatCreateModel'), response: { 201: $ref('chatItemModel') } }, preHandler: [app.authenticate] }, createChat);

	app.get('/:id/messages', { schema: { response: $ref('messages') }, preHandler: [app.authenticate] }, getMessages);
	app.post('/:id/messages', { schema: { response: $ref('messageCreateModel') }, preHandler: [app.authenticate] }, sendMessage);

	done();
}
