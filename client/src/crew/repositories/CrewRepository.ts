import CrewModel from '../model/CrewModel';

interface CrewRepository {
  findAll(): Promise<CrewModel[]>;
}

export default CrewRepository;
