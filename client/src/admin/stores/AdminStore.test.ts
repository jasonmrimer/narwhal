import { AdminStore } from './AdminStore';
import { UnauthorizedErrorResponse } from '../../utils/HTTPClient';
import { DoubleRepositories } from '../../utils/Repositories';

describe('AdminStore', () => {
  const profiles = [{
    id: 1,
    username: 'user',
    siteId: 1,
    siteName: 'site1',
    roleId: 1,
    roleName: 'ADMIN',
    classified: false
  }];
  const roles = [
    {id: 1, name: 'ROLE !'}
  ];
  let subject: AdminStore;

  it('should fetch profiles and roles on hydrate', () => {
    subject = new AdminStore(DoubleRepositories);

    expect(subject.profiles.length).toBe(0);
    expect(subject.roleOptions.length).toBe(0);

    subject.hydrate(profiles, roles);

    expect(subject.hasError).toBeFalsy();
    expect(subject.profiles.length).toBeGreaterThan(0);
    expect(subject.roleOptions.length).toBeGreaterThan(0);
  });

  it('should show a message when the user is unauthorized', () => {
    subject = new AdminStore(DoubleRepositories);

    subject.hydrate(new UnauthorizedErrorResponse('Some clever response'), roles);

    expect(subject.profiles.length).toBe(0);
    expect(subject.hasError).toBeTruthy();
    expect(subject.error).toBeDefined();
  });

  it('should update the profiles with the provided role Id', async () => {
    subject = new AdminStore(DoubleRepositories);
    subject.hydrate(profiles, roles);

    const profile = subject.profiles[0];
    expect(subject.profiles[0].roleId).not.toBe(45);

    await subject.setProfileRole(profile, 45);
    expect(subject.profiles[0].roleId).toBe(45);
  });
});