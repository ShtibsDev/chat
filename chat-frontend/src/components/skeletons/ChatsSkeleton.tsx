import { ChatListItemSkeleton } from './ChatListSkeleton';
import { FC } from 'react';

const ChatsSkeleton: FC = () => {
	return (
		<>
			{Array.from(Array(20).keys()).map((k) => (
				<ChatListItemSkeleton key={k} />
			))}
		</>
	);
};

export default ChatsSkeleton;
