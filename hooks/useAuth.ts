import { useMutation } from '@tanstack/react-query';
import { signupAction, loginAction } from '@/app/actions/auth';
import { SignupFormData, LoginFormData } from '@/lib/validations/auth';
import { useRouter } from 'next/navigation';

export function useSignup() {
    const router = useRouter();

    return useMutation({
        mutationFn: async (data: SignupFormData) => {
            const result = await signupAction(data);
            if (result.error) {
                throw new Error(result.error);
            }
            return result;
        },
        onSuccess: () => {
            // Redirect to onboarding after successful signup
            router.push('/onboarding');
        },
    });
}

export function useLogin() {
    const router = useRouter();

    return useMutation({
        mutationFn: async (data: LoginFormData) => {
            const result = await loginAction(data);
            if (result.error) {
                throw new Error(result.error);
            }
            return result;
        },
        onSuccess: () => {
            // Redirect to onboarding after successful login
            router.push('/onboarding');
        },
    });
}
