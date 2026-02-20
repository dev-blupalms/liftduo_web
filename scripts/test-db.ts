import { prisma } from '../lib/prisma';

async function main() {
    try {
        console.log('Connecting to database...');
        // Try to count users to verify connection
        const count = await prisma.user.count();
        console.log(`Successfully connected! User count: ${count}`);
    } catch (error) {
        console.error('Error connecting to database:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
