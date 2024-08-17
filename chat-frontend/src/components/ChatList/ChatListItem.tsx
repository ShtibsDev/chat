import { Avatar, AvatarFallback } from '../ui/avatar';
import { type FC, memo, useMemo } from 'react';

import type { ChatItem } from '@/types/Chat';
import type { CurrentChat } from '@/stores/ChatStore';
import useUsers from '@/hooks/useUsers';
import dayjs from 'dayjs';
import { useAuth } from '@/context/AuthContext';

type ChatListItemProps = {
	chat: ChatItem;
	onClick: (chat: CurrentChat) => void;
};

const ChatListItem: FC<ChatListItemProps> = memo(({ chat, onClick }) => {
	const { user } = useAuth();
	const { data: users } = useUsers();

	const avatarLetters = useMemo(() => {
		if (chat.users.length > 2) return 'G';
		const otherUser = users.get(chat.users.find((u) => u !== user?._id)!);
		const userForName = otherUser ?? user;
		if (!userForName) return '';
		const names = userForName.name.toUpperCase().split(' ');
		return `${names[0][0]}${names[names.length - 1][0]}`;
	}, [chat.users, user, users]);

	const createdAt = useMemo(() => {
		if (!chat.lastMessage) return '';
		const date = new Date(chat.lastMessage.createdAt);
		const isToday = date.toDateString() === new Date().toDateString();

		if (isToday) return dayjs(date).format('HH:mm');
		return dayjs(date).format('DD/MM/YYYY');
	}, [chat.lastMessage]);

	return (
		<li className='chat-item' onClick={() => onClick(chat)}>
			<Avatar className='h-12 w-12'>
				<AvatarFallback>{avatarLetters}</AvatarFallback>
			</Avatar>
			<div className='flex flex-col text-nowrap gap-2'>
				<div className='flex justify-between'>
					<span className='h-4 font-bold text-sm overflow-ellipsis'>
						{chat.name ??
							chat.users
								.filter((u) => u !== user?._id)
								.map((u) => users.get(u)?.name)
								.join(', ')}
					</span>
					<span className='text-xs'>{createdAt}</span>
				</div>
				{chat.lastMessage && (
					<span className='h-4 w-[200px] text-xs overflow-ellipsis'>
						{users.get(chat.lastMessage.user)?.name}: {chat.lastMessage.text}
					</span>
				)}
			</div>
		</li>
	);
});

export default ChatListItem;
