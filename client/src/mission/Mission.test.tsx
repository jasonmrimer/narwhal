import * as React from 'react';
import { MissionModel } from './models/MissionModel';
import { mount, shallow, ShallowWrapper } from 'enzyme';
import { Mission } from './Mission';
import * as moment from 'moment';
import { Link } from 'react-router-dom';
import { MemoryRouter } from 'react-router';
import { SiteModelFactory } from '../site/factories/SiteModelFactory';

describe('Mission', () => {
  let subject: ShallowWrapper;
  let mission: MissionModel;
  beforeEach(() => {
    mission = new MissionModel(
      1,
      '123',
      'fakeMission',
      moment('2017-12-12T09:00:00Z'),
      null,
      'U-2',
      moment('2017-12-11T12:00:00Z')
    );

    subject = shallow(<Mission mission={mission}/>);
  });

  it('renders the mission atoMissionNumber', () => {
    expect(subject.find('.mission-header').text()).toContain(mission.atoMissionNumber);
  });

  it('should render the core site assigned to that mission', () => {
    expect(subject.find('.mission-details').text()).toContain('Unassigned');
    mission.site = SiteModelFactory.build(1, 1);

    subject = shallow(<Mission mission={mission}/>);
    expect(subject.find('.mission-details').text()).toContain(`CORE SITE: ${mission.site!.name}`);
  });

  it('renders the mission last updated', () => {
    expect(subject.find('.mission-details').text()).toContain(`Last updated ${mission.displayUpdatedAt}.`);
  });

  it('renders TBD when mission endDate not provided', () => {
    expect(subject.find('.mission-details').text()).toContain('TBD');
  });

  it('renders a link to the related crew page', () => {
    const mountedSubject = mount(
      <MemoryRouter>
        <Mission mission={mission}/>
      </MemoryRouter>
    );

    expect(mountedSubject.find(Link).prop('to')).toBe(`/dashboard/crew/${mission.id}`);
  });
});