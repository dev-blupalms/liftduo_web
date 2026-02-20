import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateTrainerOnboardingAction } from '@/app/actions/onboarding';
import { useRouter } from 'next/navigation';

export function useTrainerOnboarding() {
    const router = useRouter();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: { step: number;[key: string]: unknown }) => {
            const result = await updateTrainerOnboardingAction(data);
            if (result.error) {
                throw new Error(result.error);
            }
            return result;
        },
        onSuccess: () => {
            // Update the cache if needed
            queryClient.invalidateQueries({ queryKey: ['user'] });

            // For single-page onboarding, we stay on /onboarding
            // The page component will handle rendering the correct step based on updated user data
            router.push('/onboarding');
        },
    });
}
