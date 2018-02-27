import { CrewRepository } from './CrewRepository';
import { CrewModel } from '../models/CrewModel';
import { MissionModelFactory } from '../../mission/factories/MissionModelFactory';
import { CrewPositionModel } from '../models/CrewPositionModel';
import { AirmanModelFactory } from '../../airman/factories/AirmanModelFactory';

export function crewRepositoryContract(subject: CrewRepository) {
  describe('findOne', () => {
    it('returns a crew', async () => {
      const crew = await subject.findOne(1);
      expect(crew.mission).toBeDefined();
      expect(crew.crewPositions).toBeDefined();
    });
  });

  describe('save', () => {
    it('saves a crew', async () => {
      const airman = AirmanModelFactory.build();
      const mission = MissionModelFactory.build();
      const crewPositions = [new CrewPositionModel(1, airman, 'QB')];
      const crew = new CrewModel(1, mission, crewPositions);

      const resp = await subject.save(crew);

      expect(resp.mission).toBeDefined();
      expect(resp.crewPositions).toBeDefined();
    });
  });
}
