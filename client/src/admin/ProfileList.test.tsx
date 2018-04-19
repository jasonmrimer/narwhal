import * as React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { ProfileList, ProfileListStore } from './ProfileList';
import { ErrorResponse } from '../utils/HTTPClient';

describe('ProfileList', () => {
  let subject: ShallowWrapper;
  let store: ProfileListStore;

  beforeEach(() => {
    store = {
      hydrate: jest.fn(),
      profiles: [
        {id: 1, role: '', classified: false, siteId: 1, siteName: '1', username: 'User1'},
        {id: 2, role: '', classified: false, siteId: 1, siteName: '1', username: 'User2'}
      ],
      hasError: false,
      error: null
    };
    subject = shallow(<ProfileList store={store}/>);
  });

  it('should hydrate the admin store on mount', async () => {
    await (subject.instance() as ProfileList).componentDidMount();
    expect(store.hydrate).toHaveBeenCalled();
  });

  it('should display a list of users', () => {
    expect(subject.find('.profile-row').length).toBe(store.profiles.length);
    expect(subject.find('.profile-row').at(0).text()).toContain('User1');
    expect(subject.find('.profile-row').at(1).text()).toContain('User2');
  });

  it('should display an error', () => {
    store.hasError = true;
    store.error = new ErrorResponse('A Message');
    subject = shallow(<ProfileList store={store}/>);
    expect(subject.find('.error').at(0).text()).toContain(store.error.message);
  });
});