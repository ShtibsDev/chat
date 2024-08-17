import type Message from './Message';
import { z } from 'zod';

type Chat = {
	_id: string;
	name: string | null;
	users: string[];
	messages: Message[];
};

export type ChatItem = Omit<Chat, 'messages'> & { lastMessage: Message | null };

export const createChatSchema = z.object({
	users: z.array(z.string()),
	name: z.string().optional(),
});

export type ChatCreateModel = z.infer<typeof createChatSchema>;

export default Chat;
