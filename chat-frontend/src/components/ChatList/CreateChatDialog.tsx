import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';

import { Button } from '../ui/button';
import { FC, useState, type ReactNode } from 'react';

import useUsers from '@/hooks/useUsers';
import {
	MultiSelector,
	MultiSelectorContent,
	MultiSelectorInput,
	MultiSelectorItem,
	MultiSelectorList,
	MultiSelectorTrigger,
} from '../ui/multi-selector';
import type User from '@/types/User';
import { useAuth } from '@/context/AuthContext';
import { Input } from '../ui/input';
import { useMutation } from '@tanstack/react-query';
import { createChat } from '@/services/chats-service';
import { createChatSchema } from '@/types/Chat';

const CreateChatDialog: FC<{ children: ReactNode }> = ({ children }) => {
	const [open, setOpen] = useState(false);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogForm onChatCreated={() => setOpen(false)} />
		</Dialog>
	);
};

function DialogForm({ onChatCreated: emitChatCreated }: { onChatCreated: () => void }) {
	const { data: users } = useUsers();
	const { user } = useAuth();
	const options = users ? [...users.values()].reduce<User[]>((users, u) => (u._id === user?._id ? users : [...users, u]), []) : [];
	const [selected, setSelected] = useState<string[]>([]);
	const [name, setName] = useState<string>();
	const createMutation = useMutation({ mutationFn: createChat, onSuccess: emitChatCreated });

	const handleSubmit = () => {
		const chat = createChatSchema.parse({ users: selected, name });
		createMutation.mutate(chat);
	};

	return (
		<DialogContent className='w-[25rem]'>
			<DialogHeader>
				<DialogTitle>New Chat</DialogTitle>
			</DialogHeader>
			<MultiSelector values={selected} onValuesChange={setSelected}>
				<MultiSelectorTrigger render={(val) => users.get(val)?.name}>
					<MultiSelectorInput placeholder='Select people to chat with' />
				</MultiSelectorTrigger>
				<MultiSelectorContent>
					<MultiSelectorList>
						{options.map((option) => (
							<MultiSelectorItem key={option._id} value={option._id}>
								{option.name}
							</MultiSelectorItem>
						))}
					</MultiSelectorList>
				</MultiSelectorContent>
			</MultiSelector>
			<Input value={name} onChange={(e) => setName(e.target.value)} placeholder='Chat name (optional)' />
			<DialogFooter>
				<Button onClick={handleSubmit} disabled={!selected.length || createMutation.isPending}>
					{createMutation.isPending ? 'Loading...' : 'Create Chat'}
				</Button>
			</DialogFooter>
		</DialogContent>
	);
}

export default CreateChatDialog;
