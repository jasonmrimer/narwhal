import { AdminSquadronStore } from './AdminSquadronStore';
import { AdminSquadronRepositoryStub } from '../repositories/doubles/AdminSquadronRepositoryStub';

describe('AdminSquadronStore', () => {
  let adminSquadronStore: AdminSquadronStore;
  beforeEach(async () => {
    const repo = new AdminSquadronRepositoryStub();
    adminSquadronStore = new AdminSquadronStore();
    adminSquadronStore.hydrate(await repo.findAll());
  });

  it('should hydrate squadrons', () => {
    expect(adminSquadronStore.squadrons.length).toBe(1);
  });
});