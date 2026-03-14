import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
<<<<<<< ours
  const email = process.env.SEED_USER_EMAIL?.trim();
  const password = process.env.SEED_USER_PASSWORD?.trim();
  const name = process.env.SEED_USER_NAME?.trim() || 'LeadMap Owner';

  if (!email || !password) {
    throw new Error('Set SEED_USER_EMAIL and SEED_USER_PASSWORD before running prisma:seed.');
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.upsert({
    where: { email },
    update: { name, passwordHash },
    create: { email, name, passwordHash }
=======
  const passwordHash = await bcrypt.hash('admin1234', 10);
  const user = await prisma.user.upsert({
    where: { email: 'admin@leadmap.ai' },
    update: {},
    create: { email: 'admin@leadmap.ai', name: 'LeadMap Owner', passwordHash }
>>>>>>> theirs
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
