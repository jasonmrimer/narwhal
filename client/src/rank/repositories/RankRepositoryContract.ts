import { RankRepository } from './RankRepository';

export function RankRepositoryContract(subject: RankRepository) {
  describe('findAll', () => {
    it('returns a list of all ranks', async () => {
      const ranks = await subject.findAll();
      assertFindAll(ranks);
    });
  });
}

function assertFindAll(items: { id: number }[]) {
  expect(items).toBeDefined();
  expect(items.length).toBeGreaterThan(0);
  const uniqueIds = items.map(item => item.id).filter((el, i, a) => i === a.indexOf(el));
  expect(uniqueIds.length).toEqual(items.length);
}