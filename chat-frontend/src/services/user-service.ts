import type User from '@/types/User';
import type { UserCreateModel } from '@/types/User';
import axios from 'axios';

export async function getUsers() {
	const { data } = await axios.get<User[]>('/users');
	return data;
}

export async function login(credentials: { email: string; password: string }) {
	const { data } = await axios.post<{ accessToken: string }>('/login', credentials);
	return data;
}

export async function signUp(data: UserCreateModel) {
	const res = await axios.post<User>('/users', data);
	return res.data;
}

export function logout() {
	return axios.delete<void>('/logout');
}
