import { prisma } from '../lib/prisma';

const SPECIALITIES = [
    'Yoga',
    'Fitness',
    'Dietitian',
    'Gym Workout',
    'Cardio',
    'Zumba',
    'Muscle Group',
    'Running',
    'Stamina',
    'Gut Health',
    'Food',
    'Diet',
];

async function main() {
    console.log('🌱 Seeding specialties...');

    for (const name of SPECIALITIES) {
        const slug = name.toLowerCase().trim().replace(/ /g, '-').replace(/[^\w-]/g, '');

        await prisma.specialty.upsert({
            where: { slug },
            update: { name },
            create: { name, slug }
        });

        console.log(`✅ Upserted: ${name} (${slug})`);
    }

    console.log('🚀 Seeding completed!');
    process.exit(0);
}

main().catch(err => {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
});
