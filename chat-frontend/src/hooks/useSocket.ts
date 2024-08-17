import { useEffect, useRef } from 'react';

import type { ChatItem } from '@/types/Chat';
import type Message from '@/types/Message';
import { useAuth } from '@/context/AuthContext';
import { useQueryClient } from '@tanstack/react-query';

const wsUrl = `ws://${import.meta.env.VITE_API_HOST}/ws`;

export default function useSocket() {
	const { user } = useAuth();
	const queryClient = useQueryClient();
	const ws = useRef<WebSocket>();

	useEffect(() => {
		if (!user?.email) return;

		ws.current = new WebSocket(`${wsUrl}/${user.email}`);

		ws.current.onmessage = (e) => {
			const message: Message = JSON.parse(e.data);
			if (message.user !== user._id) {
				queryClient.setQueryData(['messages', message.chat], (data: Message[]) => [...data, message]);
			}
			queryClient.setQueryData(['chat-list'], (data: ChatItem[]) =>
				data
					.map((c) => (c._id === message.chat ? { ...c, lastMessage: message } : c))
					.toSorted((a, b) => (a.lastMessage?.createdAt.getTime() ?? 0) - (b.lastMessage?.createdAt.getTime() ?? 0))
			);
		};

		ws.current.onclose = () => {
			setTimeout(() => {
				ws.current = new WebSocket(`${wsUrl}/${user.email}`);
			}, 1000);
		};

		return () => {
			ws.current?.close();
		};
	}, [queryClient, user?._id, user?.email]);

	const send = (message: { text: string; userId: number; chatRoomId: number }) => {
		ws.current?.send(JSON.stringify(message));
	};
	return { send };
}
