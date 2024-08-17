import { Badge } from '../ui/badge';
import { type FC } from 'react';
import type Message from '@/types/Message';
import { cn } from '@/lib/utils';
import dayjs from 'dayjs';
import useUsers from '@/hooks/useUsers';
import { useAuth } from '@/context/AuthContext';

type MessageBadgeProps = { message: Message };

const MessageBadge: FC<MessageBadgeProps> = ({ message }) => {
	const { data: users } = useUsers();
	const { user } = useAuth();
	const isUserOwned = user?._id === message.user;
	const dateTime = dayjs(message.createdAt).format('HH:mm');

	return (
		<Badge
			className={cn('flex flex-col items-start rounded-md', isUserOwned ? 'owned-message' : undefined)}
			variant={isUserOwned ? 'default' : 'secondary'}>
			<header className='font-bold'>{users.get(message.user)?.name}</header>
			<article>
				{message.text} {message.isOptimistic && '(Sending...)'}
			</article>
			<footer className='self-end text-2xs text-gray-400'>{dateTime}</footer>
		</Badge>
	);
};

export default MessageBadge;
