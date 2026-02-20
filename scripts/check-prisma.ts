import { prisma } from '../lib/prisma';

async function main() {
    console.log('Available models:', Object.keys(prisma).filter(k => !k.startsWith('$') && !k.startsWith('_')));
    process.exit(0);
}

main();
