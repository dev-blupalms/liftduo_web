import { SignJWT, jwtVerify } from 'jose';
import b from 'bcryptjs';
import crypto from 'crypto';

const getJwtSecret = (): Uint8Array => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('JWT_SECRET environment variable is not set');
    }
    return new TextEncoder().encode(secret);
};
const JWT_SECRET = getJwtSecret();
const ALG = 'HS256';

export const ACCESS_TOKEN_EXPIRY = '15m'; // Access token duration (short-lived)
export const REFRESH_TOKEN_EXPIRY_DAYS = 7; // Refresh token duration in days
export const REFRESH_TOKEN_EXPIRY_MS = REFRESH_TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000;
export const REFRESH_TOKEN_MAX_AGE = REFRESH_TOKEN_EXPIRY_DAYS * 24 * 60 * 60; // Seconds for cookies
export const ACCESS_TOKEN_MAX_AGE = 15 * 60; // 15 minutes in seconds for cookies

// --- Password Hashing ---

export async function hashPassword(password: string): Promise<string> {
    return await b.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
    return await b.compare(password, hash);
}

// --- Refresh Token Hashing ---

export function generateRefreshToken(): string {
    return crypto.randomBytes(32).toString('hex');
}

export function hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
}

// --- JWT Access Token ---

export interface AccessTokenPayload {
    userId: string;
    role: string;
    [key: string]: unknown;
}

export async function generateAccessToken(payload: AccessTokenPayload): Promise<string> {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: ALG })
        .setIssuedAt()
        .setExpirationTime(ACCESS_TOKEN_EXPIRY)
        .sign(JWT_SECRET);
}

export async function verifyAccessToken(token: string): Promise<AccessTokenPayload | null> {
    try {
        const { payload } = await jwtVerify(token, JWT_SECRET);
        return payload as AccessTokenPayload;
    } catch {
        return null;
    }
}
