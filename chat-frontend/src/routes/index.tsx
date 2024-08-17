import { type FC } from 'react';
import ChatList from '../components/ChatList/ChatList';
import { Button } from '../components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';

import ChatBox from '../components/ChatBox/ChatBox';
import { createFileRoute, redirect } from '@tanstack/react-router';
import useAuthActions from '@/hooks/useAuthActions';

const ChatPage: FC = () => {
	const { logoutMutation } = useAuthActions();

	return (
		<main>
			<Card className='h-4/5 w-10/12 max-h-4/5'>
				<CardHeader className='p-4 flex flex-row justify-between items-center'>
					<CardTitle>Chats</CardTitle>
					<Button onClick={() => logoutMutation.mutate()}>Logout</Button>
				</CardHeader>
				<CardContent className='chat-container'>
					<ChatList />
					<ChatBox />
				</CardContent>
			</Card>
		</main>
	);
};

export const Route = createFileRoute('/')({
	component: ChatPage,
	beforeLoad: async ({ context, location }) => {
		if (!context.authToken) {
			throw redirect({ to: '/login', search: { redirect: location.href } });
		}
	},
});

export default ChatPage;
