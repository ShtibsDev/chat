import { chatCreateModel, chatItemModel } from '../models/chat.model.js';
import { loginModel, loginResponseModel } from '../models/login.model.js';
import { userCreateModel, userResponseModel } from '../models/user.model.js';

import { buildJsonSchemas } from 'fastify-zod';
import { messageModel } from '../models/message.model.js';
import { z } from 'zod';

export const { schemas, $ref } = buildJsonSchemas({
	loginModel,
	loginResponseModel,
	userCreateModel,
	userResponseModel,
	chatCreateModel,
	chatItemModel,
	chatItemsModel: z.array(chatItemModel),
	messages: z.array(messageModel),
	messageCreateModel: z.object({ text: z.string().transform((s) => s.trim()) }),
});
