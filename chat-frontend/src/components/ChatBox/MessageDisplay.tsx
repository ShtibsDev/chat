import { FC, useLayoutEffect, useRef } from 'react';

import MessageBadge from './MessageBadge';
import { getMessages } from '@/services/chats-service';
import useChatStore from '@/stores/ChatStore';
import { useQuery } from '@tanstack/react-query';

const MessageDisplay: FC = () => {
	const { chat } = useChatStore();
	const containerRef = useRef<HTMLDivElement>(null);
	const { data: messages, isLoading } = useQuery({
		queryKey: [`messages`, chat?._id],
		enabled: !!chat,
		queryFn: () => getMessages(chat!._id!),
		initialData: [],
	});

	useLayoutEffect(() => {
		containerRef.current?.scrollTo({ top: containerRef.current.scrollHeight, behavior: 'smooth' });
	}, [messages.length]);

	if (isLoading) return <>Loading...</>;

	return (
		<article className='chat-messages' ref={containerRef}>
			{messages.map((message) => (
				<MessageBadge key={message._id} message={message} />
			))}
		</article>
	);
};

export default MessageDisplay;
