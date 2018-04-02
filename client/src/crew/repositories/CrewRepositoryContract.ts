import { CrewRepository } from './CrewRepository';

export function crewRepositoryContract(subject: CrewRepository) {
  describe('findOne', () => {
    it('returns a crew', async () => {
      const crew = await subject.findOne(1);
      expect(crew.mission).toBeDefined();
      expect(crew.crewPositions).toBeDefined();
    });
  });
}
