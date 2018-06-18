import { TopBarActions } from './TopBarActions';

describe('TopBarActions', () => {
  let profileStore: any;
  let subject: TopBarActions;

  beforeEach(() => {
    profileStore = {
      performLoading: (fn: any) => {
        fn();
      },
      resetProfile: jest.fn()
    };

    subject = new TopBarActions(
      {profileStore: profileStore} as any
    );
  });

  it('should reset profile', async () => {
    await subject.resetProfile();
    expect(profileStore.resetProfile).toHaveBeenCalled();
  });

});
