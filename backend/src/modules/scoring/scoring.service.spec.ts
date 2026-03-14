import { ScoringService } from './scoring.service';

describe('ScoringService', () => {
  it('clamps score to 100', async () => {
    const prisma = {
      scoringRule: {
        findMany: jest.fn().mockResolvedValue([
          { key: 'no_website', weight: 80 },
          { key: 'niche_fit', weight: 50 }
        ])
      }
    } as any;
    const service = new ScoringService(prisma);
    const score = await service.scoreBusiness('u1', {
      website: null,
      isOutdatedSite: false,
      reviewCount: 10,
      niche: 'gyms',
      hasWhatsapp: true,
      isChain: false
    } as any);
    expect(score).toBe(100);
  });
});
