import { AdminStore } from './AdminStore';
import { UnauthorizedErrorResponse } from '../../utils/HTTPClient';
import { ProfileRepositoryStub } from '../../profile/repositories/doubles/ProfileRepositoryStub';

describe('AdminStore', () => {
  let subject: AdminStore;

  it('should fetch profiles on hydrate', async () => {
    subject = new AdminStore(new ProfileRepositoryStub());
    expect(subject.profiles.length).toBe(0);
    await subject.hydrate();
    expect(subject.hasError).toBeFalsy();
    expect(subject.profiles.length).toBeGreaterThan(0);
  });

  it('should show a message when the user is unauthorized', async () => {
    const mockRepo = {
      findAll: function () {
        return Promise.resolve(new UnauthorizedErrorResponse('Some clever response'));
      },
      findOne: jest.fn(),
      save: jest.fn()
    };

    subject = new AdminStore(mockRepo);

    await subject.hydrate();

    expect(subject.profiles.length).toBe(0);
    expect(subject.hasError).toBeTruthy();
    expect(subject.error).toBeDefined();
  });
});