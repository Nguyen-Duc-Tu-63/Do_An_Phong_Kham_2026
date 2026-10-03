import { prisma } from '../lib/prisma';

async function main() {
  const result = await prisma.user.updateMany({
    data: {
      avatarUrl: '/images/default-avatar.svg',
    },
  });

  console.log(`Đã cập nhật ${result.count} người dùng về avatar mặc định trắng tượng trưng (/images/default-avatar.svg).`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
