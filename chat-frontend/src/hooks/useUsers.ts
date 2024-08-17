import type User from '@/types/User';
import { useQuery } from '@tanstack/react-query';

export default function useUsers() {
	return useQuery({ queryKey: ['users'], initialData: new Map<string, User>() });
}
