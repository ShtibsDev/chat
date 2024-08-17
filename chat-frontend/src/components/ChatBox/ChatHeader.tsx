import { Button } from '../ui/button';
import { type FC } from 'react';
import useChatStore from '@/stores/ChatStore';
import useUsers from '@/hooks/useUsers';
import { useAuth } from '@/context/AuthContext';

const ChatHeader: FC = () => {
	const { user } = useAuth();
	const { data: users } = useUsers();
	const { chat, setChat } = useChatStore();

	const headerTitle = chat?.users
		.reduce<string[]>((names, userId) => {
			if (userId !== user?._id) return [...names, users.get(userId)!.name];
			return names;
		}, [])
		.join(', ');

	return (
		<header className='flex gap-4'>
			<Button className='show-chat-list-btn' onClick={() => setChat(null)}>
				Back
			</Button>
			<div className='flex-1'>
				<h2 className='font-bold'>{headerTitle}</h2>
			</div>
		</header>
	);
};

export default ChatHeader;
