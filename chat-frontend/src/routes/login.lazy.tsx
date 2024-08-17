import { Card, CardContent, CardTitle } from '../components/ui/card';
import { type FC } from 'react';
import { Form } from '../components/ui/form';

import { Button } from '../components/ui/button';
import { createLazyFileRoute, Link } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import InputField from '@/components/utils/InputField';
import useAuthActions from '@/hooks/useAuthActions';

type LoginStat = { email: string; password: string };

const LoginPage: FC = () => {
	const form = useForm<LoginStat>({ defaultValues: { email: '', password: '' } });
	const { loginMutation } = useAuthActions();

	const handleSubmit = async (value: LoginStat) => {
		loginMutation.mutate(value);
	};

	return (
		<main>
			<Card className='min-w-72'>
				<CardTitle className='p-4'>Login</CardTitle>
				<CardContent className='h-full'>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-8'>
							<fieldset>
								<InputField<LoginStat> name='email' formControl={form.control} label='Email' inputType='email' />
								<InputField<LoginStat> name='password' formControl={form.control} label='Password' inputType='password' />
							</fieldset>
							<footer className='flex justify-between items-center'>
								<Link type='button' to='/register'>
									Register
								</Link>
								<Button type='submit' disabled={loginMutation.isPending}>
									{loginMutation.isPending ? 'Loading...' : 'Login'}
								</Button>
								{loginMutation.isError && <div className='text-red-500'>{loginMutation.error.message}</div>}
							</footer>
						</form>
					</Form>
				</CardContent>
			</Card>
		</main>
	);
};

export const Route = createLazyFileRoute('/login')({ component: LoginPage });

export default LoginPage;
