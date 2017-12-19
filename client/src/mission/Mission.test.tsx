import * as React from 'react';
import {MissionModel} from './models/MissionModel';
import {shallow} from 'enzyme';
import { Mission } from './Mission';

describe('Mission', () => {
  it('renders the mission atoMissionNumber', () => {
    const mission = new MissionModel('123', 'fakeMission');
    const subject = shallow(<Mission mission={mission}/>);
    expect(subject.text()).toContain(mission.atoMissionNumber);
  });
});