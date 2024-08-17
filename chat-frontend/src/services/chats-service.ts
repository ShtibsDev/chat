import type { ChatCreateModel, ChatItem } from '@/types/Chat';

import type Chat from '@/types/Chat';
import type Message from '@/types/Message';
import axios from 'axios';

export async function getChatList() {
	const { data } = await axios.get<ChatItem[]>('/chats');
	return data;
}

export async function getMessages(chatId: string) {
	const { data } = await axios.get<Message[]>(`/chats/${chatId}/messages`);
	return data;
}

export async function createChat(chat: ChatCreateModel) {
	const { data } = await axios.post<Chat>('/chats', chat);
	return data;
}

export async function sendMessage(message: { text: string }, chatId: string) {
	const { data } = await axios.post<Message>(`/chats/${chatId}/messages`, message);
	return data;
}
