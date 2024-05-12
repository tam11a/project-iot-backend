import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const tam = await prisma.user.upsert({
    where: { email: 'ibrahimsadiktamim@gmail.com' },
    update: {},
    create: {
      first_name: 'Ibrahim Sadik',
      last_name: 'Tamim',
      email: 'ibrahimsadiktamim@gmail.com',
      password: '12riothomas',
      role: {
        connectOrCreate: {
          where: { label: 'Developer' },
          create: {
            label: 'Developer',
            permissions: ['*'],
          },
        },
      },
    },
  });

  console.log('Created user: ', tam);
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
