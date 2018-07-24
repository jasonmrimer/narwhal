import { AdminSquadronRepository } from '../AdminSquadronRepository';
import { AdminSquadronModel } from '../../models/AdminSquadronModel';

export class AdminSquadronRepositoryStub implements AdminSquadronRepository {
  findAll(): Promise<AdminSquadronModel[]> {
    return Promise.resolve(
      [new AdminSquadronModel(1, 'site', 2, 'squadron')]
    );
  }
}