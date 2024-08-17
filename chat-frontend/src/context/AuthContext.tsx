import { createContext, useContext, useEffect, useMemo, useState, type FC, type ReactNode } from 'react';

import axios from 'axios';
import type User from '@/types/User';
import { jwtDecode } from 'jwt-decode';

type AuthState = { user: User | null; token: string | null; setToken: (newToken: string | null) => void };

export const AuthContext = createContext<AuthState>(undefined!);

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
	const [token, _setToken] = useState(localStorage.getItem('token'));
	const [user, setUser] = useState<User | null>(token ? jwtDecode(token) : null);
	const setToken = (newToken: string | null) => _setToken(newToken);

	const value = useMemo(() => ({ user, token, setToken }), [token, user]);

	useEffect(() => {
		if (token) {
			axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
			setUser(jwtDecode(token));
			localStorage.setItem('token', token);
		} else {
			delete axios.defaults.headers.common['Authorization'];
			setUser(null);
			localStorage.removeItem('token');
		}
	}, [token]);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
