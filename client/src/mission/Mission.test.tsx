import * as React from 'react';
import { MissionModel } from './models/MissionModel';
import { mount, shallow, ShallowWrapper } from 'enzyme';
import { Mission } from './Mission';
import * as moment from 'moment';
import { Link } from 'react-router-dom';
import { MemoryRouter } from 'react-router';

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
      false
    );
    subject = shallow(<Mission mission={mission}/>);
  });

  it('renders the mission atoMissionNumber', () => {
    expect(subject.text()).toContain(mission.atoMissionNumber);
  });

  it('renders TBD when mission endDate not provided', () => {
    expect(subject.text()).toContain('TBD');
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