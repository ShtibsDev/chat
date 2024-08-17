import useSocket from '@/hooks/useSocket';
import { createContext, type FC, type ReactNode } from 'react';

export const MessagingContext = createContext<ReturnType<typeof useSocket>>(undefined!);

export const MessagingProvider: FC<{ children: ReactNode }> = ({ children }) => {
	const value = useSocket();

	return <MessagingContext.Provider value={value}>{children}</MessagingContext.Provider>;
};
