import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function clean() {
  const a = await prisma.article.deleteMany({});
  console.log("Articles deleted:", a.count);
  const s = await prisma.submission.deleteMany({});
  console.log("Submissions deleted:", s.count);
  await prisma.$disconnect();
}
clean().catch(e => { console.error(e); process.exit(1); });
