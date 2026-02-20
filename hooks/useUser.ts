import { useQuery } from '@tanstack/react-query';
import { getCurrentUserAction } from '@/app/actions/user';

export function useUser() {
    return useQuery({
        queryKey: ['user'],
        queryFn: async () => {
            const result = await getCurrentUserAction();
            if (result.error) {
                throw new Error(result.error);
            }
            return result.data.user;
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
        retry: (failureCount, error) => {
            if (error.message === 'Unauthorized') return false;
            return failureCount < 3;
        },
    });
}
