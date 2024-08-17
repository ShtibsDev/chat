import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { Link, createLazyFileRoute } from '@tanstack/react-router';

import { Button } from '@/components/ui/button';
import { type FC } from 'react';
import { userSchema, type UserCreateModel } from '@/types/User';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import InputField from '@/components/utils/InputField';
import useAuthActions from '@/hooks/useAuthActions';

const RegisterPage: FC = () => {
	const form = useForm<UserCreateModel>({ defaultValues: { email: '', name: '' }, resolver: zodResolver(userSchema) });
	const { registerMutation } = useAuthActions();

	const handleSubmit = (data: UserCreateModel) => {
		registerMutation.mutate(data);
	};

	return (
		<main>
			<Card className='min-w-72'>
				<CardTitle className='p-4'>Registration</CardTitle>
				<CardContent>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-8'>
							<fieldset>
								<InputField<UserCreateModel> name='email' formControl={form.control} label='Email' inputType='email' />
								<InputField<UserCreateModel> name='name' formControl={form.control} label='Name' />
							</fieldset>
							<footer className='flex justify-between items-center'>
								<Link to='/login'>Sign In</Link>
								<Button type='submit' disabled={registerMutation.isPending}>
									{!registerMutation.isPending ? 'Create User' : 'Loading...'}
								</Button>
							</footer>
						</form>
					</Form>
				</CardContent>
			</Card>
		</main>
	);
};

export const Route = createLazyFileRoute('/register')({
	component: RegisterPage,
});
