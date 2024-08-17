import './index.css';

import { RouterProvider, createRouter } from '@tanstack/react-router';

import { AuthProvider } from './context/AuthContext.tsx';
import React, { type FC } from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import { routeTree } from './routeTree.gen.ts';
import { useAuth } from './context/AuthContext.tsx';

const baseUrl = `http://${import.meta.env.VITE_API_HOST}`;

axios.defaults.baseURL = baseUrl;

const router = createRouter({ routeTree, context: undefined! });

declare module '@tanstack/react-router' {
	interface Register {
		router: typeof router;
	}
}

// eslint-disable-next-line react-refresh/only-export-components
const RouterApp: FC = () => {
	const { token } = useAuth();

	return <RouterProvider router={router} context={{ authToken: token }} />;
};

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<AuthProvider>
			<RouterApp />
		</AuthProvider>
	</React.StrictMode>
);
