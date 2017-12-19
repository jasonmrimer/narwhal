import * as React from 'react';
import {Dashboard} from './Dashboard';
import {mount} from 'enzyme';
import MissionRepositoryStub from '../mission/repositories/doubles/MissionRepositoryStub';
import Mission from '../mission/Mission';
import {forIt} from '../utils/testUtils';
import TopBar from '../TopBar';

describe('Dashboard', () => {
  const subject = mount(<Dashboard username="Tytus" missionRepository={new MissionRepositoryStub()}/>);

  it('renders a Dashboard with all missions', async () => {
    await forIt();
    subject.update();
    expect(subject.find(Mission).length).toBe(3);
  });

  it('renders the TopBar with a username and pageTitle', async () => {
    expect(subject.find(TopBar).prop('username')).toBe('Tytus');
    expect(subject.find(TopBar).prop('pageTitle')).toBe('MPS DASHBOARD');
  });
});