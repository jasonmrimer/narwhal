import { ScheduleRepository } from './ScheduleRepository';

export function ScheduleRepositoryContract(subject: ScheduleRepository) {
  describe('findAllSchedules', () => {
    it('returns a list of all schedules', async () => {
      const schedules = await subject.findAll();
      assertFindAll(schedules);
    });
  });
}

function assertFindAll(items: { id: number }[]) {
  expect(items).toBeDefined();
  expect(items.length).toBeGreaterThan(0);
  const uniqueIds = items.map(item => item.id).filter((el, i, a) => i === a.indexOf(el));
  expect(uniqueIds.length).toEqual(items.length);
}