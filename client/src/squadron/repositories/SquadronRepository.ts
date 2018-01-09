import SquadronModel from '../models/SquadronModel';

export default interface SquadronRepository {
  findAll(): Promise<SquadronModel[]>;
}