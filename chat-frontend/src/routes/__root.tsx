import { Outlet, createRootRouteWithContext } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import type { FC } from 'react';
import { MessagingProvider } from '../context/messaging-context';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ThemeProvider } from '../components/providers/theme-provider';
import { ThemeToggle } from '../components/ui/theme-toggle';

const queryClient = new QueryClient();

type RouterContext = { authToken: string | null };

const Layout: FC = () => {
	return (
		<QueryClientProvider client={queryClient}>
			<ThemeProvider defaultTheme='dark' storageKey='theme'>
				<MessagingProvider>
					<ThemeToggle />
					<Outlet />
					<ReactQueryDevtools initialIsOpen={false} />
				</MessagingProvider>
			</ThemeProvider>
		</QueryClientProvider>
	);
};

export const Route = createRootRouteWithContext<RouterContext>()({ component: Layout });

export default Layout;
