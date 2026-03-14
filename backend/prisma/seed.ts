import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('admin1234', 10);
  const user = await prisma.user.upsert({
    where: { email: 'admin@leadmap.ai' },
    update: {},
    create: { email: 'admin@leadmap.ai', name: 'LeadMap Owner', passwordHash }
  });

  const rules = [
    ['no_website', 'No website', 20],
    ['outdated_website', 'Outdated website', 15],
    ['low_reviews', 'Low review count', 10],
    ['niche_fit', 'Strong niche fit', 15],
    ['whatsapp_visible', 'Visible WhatsApp', 10],
    ['local_business', 'Local business', 12],
    ['chain_brand', 'Chain brand', -15],
    ['already_contacted', 'Already contacted', -10],
    ['discarded', 'Discarded lead', -100]
  ] as const;

  for (const [key, label, weight] of rules) {
    await prisma.scoringRule.upsert({
      where: { userId_key: { userId: user.id, key } },
      update: { label, weight, enabled: true },
      create: { userId: user.id, key, label, weight, enabled: true }
    });
  }
}

main().finally(async () => prisma.$disconnect());
