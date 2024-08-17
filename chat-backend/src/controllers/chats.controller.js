/** @import {FastifyRequest, FastifyReply} from 'fastify' */
/** @import {ChatCreateModel, ChatItemModel} from '../models/chat.model.js' */
/** @import {HydratedDocument} from 'mongoose' */
/** @import {ChatModel, MessageModel} from '../schemas/chat.schema.js' */
/** @import {MessageCreateModel} from '../models/message.model.js'*/
/** @import {ObjectId} from 'mongodb' */

import { Chat } from '../schemas/chat.schema.js';
import { clients } from '../utils/wsClients.js';
import { messageCreateModel } from '../models/message.model.js';

/**
 *
 * @param {FastifyRequest<{Body: ChatCreateModel}>} req
 * @param {FastifyReply} res
 */
export async function createChat(req, res) {
	const { users, name } = req.body;

	const chat = new Chat({ users: [...users, req.user._id], name: name ?? null });
	await chat.save();

	return res.status(201).send({ ...chat, lastMessage: null });
}

/**
 * @param {FastifyRequest} req
 * @returns {Promise<ChatItemModel[]>}
 */
export async function getChats(req) {
	const email = req.user.email;

	const chats = await Chat.aggregate([
		{ $lookup: { from: 'users', localField: 'users', foreignField: '_id', as: 'userDetails' } },
		{ $match: { 'userDetails.email': email } },
		{
			$project: {
				_id: 1,
				users: 1,
				name: 1,
				lastMessage: {
					$cond: {
						if: { $gt: [{ $size: '$messages' }, 0] },
						then: { $arrayElemAt: ['$messages', -1] },
						else: null,
					},
				},
			},
		},
	]).sort({ 'lastMessage.createdAt': 'desc' });

	return chats;
}

/**
 * @param {FastifyRequest<{Params: {id: string}}>} req
 * @returns {Promise<MessageModel[]>}
 */
export async function getMessages(req) {
	const chat = await Chat.findById(req.params.id, 'messages').lean();
	return chat?.messages ?? [];
}

/**
 * @param {FastifyRequest<{Params: {id: string}, Body: {text: string}}>} req
 * @param {FastifyReply} res
 */
export async function sendMessage(req, res) {
	const { id } = req.params;
	const { text } = req.body;
	const data = messageCreateModel.parse({ text, chatId: id, userId: req.user._id });
	const message = await createMessage(data);

	res.status(201).send(message);

	const receivers = await getReceivers(id);

	receivers.forEach((receiver) => {
		const connection = clients.get(receiver.toString());
		if (connection && connection.readyState === 1) {
			connection.send(JSON.stringify(message));
		}
	});
}

/** @param {MessageCreateModel} message  */
async function createMessage({ chatId, userId, text }) {
	const chat = await Chat.findById(chatId);

	const message = { text, user: userId, chat: chatId, createAt: new Date() };
	chat.messages.push(message);
	await chat.save();
	return chat.messages.at(-1);
}

/**
 * @param {string} chatId
 * @returns {Promise<ObjectId[]>}
 * */
async function getReceivers(chatId) {
	const { users } = await Chat.findById(chatId, 'users').lean();
	return users;
}
