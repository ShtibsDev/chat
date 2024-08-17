import ChatListItem from './ChatListItem';
import { ChatListSkeleton } from '../skeletons/ChatListSkeleton';
import { FC } from 'react';
import { Input } from '../ui/input';
import { getChatList } from '@/services/chats-service';
import { getUsers } from '@/services/user-service';
import useChatStore, { type CurrentChat } from '@/stores/ChatStore';
import { useQuery } from '@tanstack/react-query';
import CreateChatDialog from './CreateChatDialog';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';

const ChatList: FC = () => {
	const { setChat } = useChatStore();
	const { chat } = useChatStore();
	const { data: chatList, isLoading: isChatsLoading } = useQuery({ initialData: [], queryKey: ['chat-list'], queryFn: getChatList });

	const { isLoading: isUsersLoading } = useQuery({
		queryKey: ['users'],
		queryFn: () => getUsers().then((users) => new Map(users.map((u) => [u._id, u]))),
	});

	const handleChatSelect = (chat: CurrentChat) => setChat(chat);

	return (
		<aside className={cn('chat-list', chat ? 'hide' : null)}>
			<Input type='search' placeholder='Search' />
			<ul className='chat-items'>
				{isChatsLoading || isUsersLoading ? (
					<ChatListSkeleton />
				) : (
					chatList.map((chat) => <ChatListItem key={chat._id} chat={chat} onClick={handleChatSelect} />)
				)}
			</ul>
			<CreateChatDialog>
				<Button variant='outline' className='w-full'>
					New Chat
				</Button>
			</CreateChatDialog>
		</aside>
	);
};

export default ChatList;
