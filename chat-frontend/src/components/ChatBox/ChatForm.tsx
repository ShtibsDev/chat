import { Form, FormControl, FormField } from '../ui/form';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Button } from '../ui/button';
import { type FC } from 'react';
import { Input } from '../ui/input';
import type Message from '@/types/Message';
import { sendMessage } from '@/services/chats-service';
import useChatStore from '@/stores/ChatStore';

import { useForm } from 'react-hook-form';
import { useAuth } from '@/context/AuthContext';

const ChatForm: FC = () => {
	const form = useForm<{ text: string }>({ defaultValues: { text: '' } });
	const { chat } = useChatStore();
	const { user } = useAuth();
	const queryClient = useQueryClient();
	const queryKey = ['messages', chat?._id];

	const { mutate: send } = useMutation({
		mutationFn: (text: string) => sendMessage({ text }, chat!._id!),
		onMutate: async (text) => {
			await queryClient.cancelQueries({ queryKey });

			const prevMessages = queryClient.getQueryData<Message[]>(queryKey) ?? [];

			const newMessage: Message = { _id: '', chat: chat!._id, text, user: user!._id!, createdAt: new Date(), isOptimistic: true };

			queryClient.setQueryData(queryKey, [...prevMessages, newMessage]);
			return { prevMessages };
		},
		onError(_error, _text, context) {
			queryClient.setQueryData(queryKey, context?.prevMessages);
		},
		onSuccess(data, _variables, context) {
			queryClient.setQueryData(queryKey, [...context.prevMessages, data]);
		},
	});

	const handleSubmit = ({ text }: { text: string }) => {
		if (!user || !chat) return;
		send(text);
		form.reset();
	};

	return (
		<footer>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(handleSubmit)}>
					<FormField
						control={form.control}
						name='text'
						render={({ field }) => (
							<FormControl>
								<Input {...field} disabled={!chat} placeholder='Type your message here...' />
							</FormControl>
						)}></FormField>
					<Button type='submit' disabled={!chat}>
						Send
					</Button>
				</form>
			</Form>
		</footer>
	);
};

export default ChatForm;
