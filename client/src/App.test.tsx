import { shallow, ShallowWrapper } from 'enzyme';
import * as React from 'react';

import App from './App';
import Tracker from './tracker/Tracker';
import { forIt } from './utils/testUtils';
import TopBar from './TopBar';
import ProfileRepositoryStub from './profile/repositories/doubles/ProfileRepositoryStub';
import AirmanRepositoryStub from './airman/repositories/doubles/AirmanRepositoryStub';
import UnitRepositoryStub from './unit/repositories/doubles/UnitRepositoryStub';

describe('App', () => {
  const airmanRepository = new AirmanRepositoryStub();
  const unitRepository = new UnitRepositoryStub();
  const profileRepository = new ProfileRepositoryStub();
  let subject: ShallowWrapper;

  it('renders a tracker', () => {
    subject = shallow(
      <App
        airmanRepository={airmanRepository}
        unitRepository={unitRepository}
        profileRepository={profileRepository}
      />
    );
    expect(subject.find(Tracker).exists()).toBeTruthy();
  });

  it('renders the TopBar with a username', async () => {
    subject = shallow(
      <App
        airmanRepository={airmanRepository}
        unitRepository={unitRepository}
        profileRepository={profileRepository}
      />
    );
    await forIt();
    subject.update();

    const profile = await profileRepository.findOne();
    expect(subject.find(TopBar).prop('username')).toBe(profile.username);
  });
});
