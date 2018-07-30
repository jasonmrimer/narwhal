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

  it('should hide delete button', () => {
    const item = new AdminSquadronModel(
      1,
      'Site1',
      1,
      'Squadron1',
      0);
    expect(subject.showDelete(item)).toBeTruthy();
  });

  it('should delete a squadron', () => {
    subject.squadrons.push(new AdminSquadronModel(14, 'Site Fourteen', 682, 'Squadron SixEightyTwo', 0));
    expect(subject.squadrons.find(s => s.squadronId === 682)).toBeDefined();
    subject.deleteSquadron(682);
    expect(subject.squadrons.find(s => s.squadronId === 682)).toBeUndefined();
  });

  it('should set a squadron to be deleted', () => {
    expect(subject.hasPendingDeleteSquadron).toBeFalsy();
    subject.setPendingDeleteSquadron(new AdminSquadronModel(14, 'Site Fourteen', 682, 'Squadron SixEightyTwo', 0));
    expect(subject.hasPendingDeleteSquadron).toBeTruthy();
  });
});