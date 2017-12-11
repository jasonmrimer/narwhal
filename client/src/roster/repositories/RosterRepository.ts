import RosterModel from '../models/RosterModel';

interface RosterRepository {
  findOne(): Promise<RosterModel>;

  findByUnit(id: number): Promise<RosterModel>;
}

export default RosterRepository;