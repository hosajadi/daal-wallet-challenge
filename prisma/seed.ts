import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
async function main() {
  console.log('Seeding...');
  const adminUser = await prisma.user.findFirst({
    where: {
      phoneNumber: '09000001111',
    },
  });
  if (!adminUser) {
    await prisma.user.create({
      data: {
        firstname: 'TestUserFirstName',
        lastname: 'TestUserLastName',
        phoneNumber: '09000001111',
        password: '$2a$10$is9LHQGUUfOoQ2kkbol.Wu8Jv25JiitY/0/TsCbum3PF.GTLF4Yvu', // adminadmin
        createdAt: new Date(Date.now()),
      },
    });
  }
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
