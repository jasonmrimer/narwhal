import { AdminSquadronStore } from './AdminSquadronStore';
import { AdminSquadronRepositoryStub } from '../repositories/doubles/AdminSquadronRepositoryStub';
import { AdminSquadronModel } from '../models/AdminSquadronModel';

describe('AdminSquadronStore', () => {
  let subject: AdminSquadronStore;

  beforeEach(async () => {
    const repo = new AdminSquadronRepositoryStub();
    subject = new AdminSquadronStore();
    subject.hydrate(await repo.findAll());
  });

  it('should hydrate squadrons', () => {
    expect(subject.squadrons.length).toBe(1);
  });

  it('should hide pending squadron popup by default', () => {
    expect(subject.hasPendingSquadron).toBeFalsy();
  });

  it('should show pending squadron popup', () => {
    subject.setPendingSquadron(new AdminSquadronModel());
    expect(subject.hasPendingSquadron).toBeTruthy();
  });

  it('should cancel pending squadron', () => {
    subject.setPendingSquadron(new AdminSquadronModel());
    subject.defaultPendingSquadron();
    expect(subject.hasPendingSquadron).toBeFalsy();
  });
});