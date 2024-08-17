import type Chat from '@/types/Chat';
import { create } from 'zustand';

export type CurrentChat = Omit<Chat, 'messages'>;

type CurrentChatStore = {
	chat: CurrentChat | null;
	setChat: (chat: CurrentChat | null) => void;
};

const useChatStore = create<CurrentChatStore>((set) => ({
	chat: null,
	setChat: (chat) => set({ chat }),
}));

export default useChatStore;
