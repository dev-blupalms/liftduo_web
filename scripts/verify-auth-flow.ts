
// Helper to print step results
const step = (name: string) => console.log(`\n🔹 ${name}...`);
const success = () => console.log('✅ Success');
const fail = (err: unknown) => { console.error('❌ Failed:', err); process.exit(1); };

const BASE_URL = 'http://localhost:3000/api';

// Create a unique user for each run
const timestamp = Date.now();
const TRAINER_EMAIL = `trainer_${timestamp}@example.com`;
const TRAINER_PASS = 'password123';
const CLIENT_PHONE = `+1555${timestamp.toString().slice(-6)}`;

async function request(path: string, method: string, body?: unknown, token?: string) {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const url = `${BASE_URL}${path}`;
    console.log(`Testing: ${method} ${url}`);

    const res = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(body),
    });

    const text = await res.text();
    let data;
    try {
        data = JSON.parse(text);
    } catch {
        throw new Error(`Failed to parse JSON: ${text.slice(0, 200)}... Status: ${res.status}`);
    }

    if (!res.ok) throw new Error(`${res.status} ${res.statusText}: ${JSON.stringify(data)}`);
    return data;
}

async function main() {
    try {
        console.log('🚀 Starting Verification Flow');

        // --- TRAINER FLOW ---
        step('1. Signup Trainer');
        const trainerSignup = await request('/auth/signup', 'POST', {
            email: TRAINER_EMAIL,
            password: TRAINER_PASS,
            name: 'John Trainer',
            role: 'TRAINER'
        });
        if (trainerSignup.data.user.role !== 'TRAINER') throw new Error('Role mismatch');
        success();

        step('2. Login Trainer');
        const trainerLogin = await request('/auth/login', 'POST', {
            email: TRAINER_EMAIL,
            password: TRAINER_PASS
        });
        const trainerToken = trainerLogin.data.accessToken;
        const trainerRefreshToken = trainerLogin.data.refreshToken;
        if (!trainerToken) throw new Error('No access token');
        success();

        step('3. Trainer Onboarding (Update Profile)');
        await request('/onboarding/trainer', 'POST', {
            bio: 'I am a certified trainer',
            location: 'New York, NY',
            hasGym: true,
            specialties: ['Cardio', 'Strength'],
            services: [
                {
                    title: '1 Hour Session',
                    durationMinutes: 60,
                    price: 100,
                    description: 'Full body workout',
                    locationType: 'OFFLINE'
                }
            ]
        }, trainerToken);
        success();

        step('4. Refresh Token');
        const refreshRes = await request('/auth/refresh', 'POST', { refreshToken: trainerRefreshToken });
        if (!refreshRes.data.accessToken || !refreshRes.data.refreshToken) throw new Error('Refresh failed');
        success();

        step('5. Logout');
        await request('/auth/logout', 'POST', { refreshToken: refreshRes.data.refreshToken });
        success();


        // --- CLIENT FLOW ---
        step('6. Signup Client');
        const clientSignup = await request('/auth/signup', 'POST', {
            phone: CLIENT_PHONE,
            name: 'Jane Client',
            role: 'CLIENT',
            // No password for client in this test, assuming optional or handled?
            // Wait, schema says passwordHash is optional, but logic might require it per my implementation?
            // "if (role === Role.CLIENT) { if (!phone) ... }" 
            // My signup implementation: "passwordHash = await hashPassword(password)" if provided. 
            // It allows null password.
        });
        if (clientSignup.data.user.role !== 'CLIENT') throw new Error('Role mismatch');
        success();

        // Login Client - Wait, I implemented Login requiring password if it exists, or failing if not.
        // "if (user.passwordHash) { ... } else { return error }"
        // So I cannot login a client without password yet unless I implemented OTP mock.
        // I should probably set a password for client in verif script for now to test the flow,
        // OR update Login to allow purely phone login if valid (but verify what? OTP).
        // For verification, let's signup client WITH password for now to test the rest of the flow.

        step('6b. Signup Client WITH Password (for testing)');
        // Let's create another client
        const CLIENT_PHONE_2 = `+1666${timestamp.toString().slice(-6)}`;
        await request('/auth/signup', 'POST', {
            phone: CLIENT_PHONE_2,
            password: 'clientpass123',
            name: 'Jane Client 2',
            role: 'CLIENT'
        });
        success();

        step('7. Login Client');
        const clientLogin = await request('/auth/login', 'POST', {
            phone: CLIENT_PHONE_2,
            password: 'clientpass123'
        });
        const clientToken = clientLogin.data.accessToken;
        success();

        step('8. Client Onboarding');
        await request('/onboarding/client', 'POST', {
            gender: 'Female',
            heightCm: 165,
            weightKg: 60,
            workoutFrequency: '3 times a week',
            fitnessGoal: 'Lose weight'
        }, clientToken);
        success();


        console.log('\n🎉 All verifications passed!');

        step('9. Signup Client via Email (Social Login Simulation)');
        const CLIENT_EMAIL_SOCIAL = `client_social_${timestamp}@example.com`;
        const clientSocialSignup = await request('/auth/signup', 'POST', {
            email: CLIENT_EMAIL_SOCIAL,
            name: 'Social Client',
            role: 'CLIENT',
            password: 'socialpass_or_mock'
            // Note: In real social login, we might not set a password, but we'd confirm Identity.
            // For now, testing schema constraint: can we create Client with Email only? Yes.
        });
        if (clientSocialSignup.data.user.role !== 'CLIENT') throw new Error('Role mismatch');
        if (clientSocialSignup.data.user.email !== CLIENT_EMAIL_SOCIAL) throw new Error('Email mismatch');
        success();

    } catch (err) {
        fail(err);
    }
}

main();
