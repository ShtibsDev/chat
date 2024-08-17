import ChatForm from './ChatForm';
import ChatHeader from './ChatHeader';
import { FC } from 'react';
import MessageDisplay from './MessageDisplay';
import { cn } from '@/lib/utils';
import useChatStore from '@/stores/ChatStore';

const ChatBox: FC = () => {
	const { chat } = useChatStore();

	return (
		<section className={cn('chat-box', chat ? 'expanded' : undefined)}>
			<ChatHeader />
			<MessageDisplay />
			<ChatForm />
		</section>
	);
};

export default ChatBox;
