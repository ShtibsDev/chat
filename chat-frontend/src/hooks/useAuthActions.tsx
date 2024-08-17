import { login, logout, signUp } from '@/services/user-service';

import { useAuth } from '@/context/AuthContext';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';

export default function useAuthActions() {
	const { setToken } = useAuth();
	const navigate = useNavigate();

	const loginMutation = useMutation({
		mutationFn: login,
		onSuccess: ({ accessToken }) => {
			setToken(accessToken);
			navigate({ to: '/' });
		},
	});

	const registerMutation = useMutation({
		mutationFn: signUp,
		onSuccess: () => {
			navigate({ to: '/' });
		},
	});

	const logoutMutation = useMutation({
		mutationFn: logout,
		onSuccess: () => {
			setToken(null);
			navigate({ to: '/login' });
		},
	});

	return { loginMutation, registerMutation, logoutMutation };
}
