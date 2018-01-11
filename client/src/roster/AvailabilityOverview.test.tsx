import * as React from 'react';
import { shallow } from 'enzyme';
import { AvailabilityOverview } from './AvailabilityOverview';
import AirmanModelFactory from '../airman/factories/AirmanModelFactory';
import PlannerServiceStub from '../tracker/services/doubles/PlannerServiceStub';

describe('AvailabilityOverview', () => {
  it('renders airmen high-level availability', () => {
    const airman = AirmanModelFactory.build(1);
    const week = new PlannerServiceStub().getCurrentWeek();
    const subject = shallow(
      <AvailabilityOverview
        airman={airman}
        week={week}
      />);

    expect(subject.find('span.unavailable').length).toBe(1);
    expect(subject.find('span.available').length).toBe(6);
  });
});