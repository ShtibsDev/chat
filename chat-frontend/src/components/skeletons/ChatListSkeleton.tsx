import { FC } from 'react';
import { Skeleton } from '../ui/skeleton';

export const ChatListItemSkeleton: FC = () => {
	return (
		<li className='chat-item'>
			<Skeleton className='h-12 w-12 rounded-full' />
			<div className='flex flex-col text-nowrap gap-2 flex-1'>
				<Skeleton className='h-4 min-w-40' />
				<Skeleton className='h-4 min-w-32 max-w-[75%]' />
			</div>
		</li>
	);
};

export const ChatListSkeleton: FC = () => {
	return (
		<>
			{Array.from(Array(10).keys()).map((k) => (
				<ChatListItemSkeleton key={k} />
			))}
		</>
	);
};
