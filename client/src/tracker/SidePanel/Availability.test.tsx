import * as React from 'react';
import { shallow } from 'enzyme';
import PlannerServiceStub from '../services/doubles/PlannerServiceStub';
import { Availability } from './Availability';

describe('Availability', () => {
  const week = new PlannerServiceStub().getCurrentWeek();
  const subject = shallow(<Availability week={week}/>);

  it('renders the availability for an airman', () => {
    expect(subject.text()).toContain('26 NOV - 02 DEC');
    expect(subject.text()).toContain('SUN, 26 NOV 17');
    expect(subject.text()).toContain('MON, 27 NOV 17');
    expect(subject.text()).toContain('TUE, 28 NOV 17');
    expect(subject.text()).toContain('WED, 29 NOV 17');
    expect(subject.text()).toContain('THU, 30 NOV 17');
    expect(subject.text()).toContain('FRI, 01 DEC 17');
    expect(subject.text()).toContain('SAT, 02 DEC 17');
  });
});