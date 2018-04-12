import * as React from 'react';
import { MissionModel } from './models/MissionModel';
import { mount, shallow } from 'enzyme';
import { Mission } from './Mission';
import * as moment from 'moment';
import { Link } from 'react-router-dom';
import { MemoryRouter } from 'react-router';

describe('Mission', () => {
  it('renders the mission atoMissionNumber', () => {
    const mission = new MissionModel(
      1,
      '123',
      'fakeMission',
      moment('2017-12-12T09:00:00Z'),
      moment('2017-12-12T15:00:00Z'),
      'U-2'
    );
    const subject = shallow(<Mission mission={mission}/>);
    expect(subject.text()).toContain(mission.atoMissionNumber);
  });

  it('renders TBD when mission endDate not provided', () => {
    const mission = new MissionModel(
      1,
      '123',
      'fakeMission',
      moment('2017-12-12T09:00:00Z'),
      null,
      'U-2'
    );
    const subject = shallow(<Mission mission={mission}/>);
    expect(subject.text()).toContain('TBD');
  });

  it('renders a link to the related crew page', () => {
    const mission = new MissionModel(
      1,
      '123',
      'fakeMission',
      moment('2017-12-12T09:00:00Z'),
      moment('2017-12-12T15:00:00Z'),
      'U-2'
    );
    const subject = mount(
      <MemoryRouter>
        <Mission mission={mission}/>
      </MemoryRouter>
    );

    expect(subject.find(Link).prop('to')).toBe(`/dashboard/crew/${mission.id}`);
  });
});