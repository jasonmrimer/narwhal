import * as React from 'react';
import { MissionPlannerRoster, StyledRow } from './MissionPlannerRoster';
import { mount, ReactWrapper } from 'enzyme';
import { FakeAirmanRepository } from '../airman/repositories/doubles/FakeAirmanRepository';

describe('MissionPlannerRoster', () => {
  let subject: ReactWrapper;
  const airmanRepository = new FakeAirmanRepository();

  beforeEach(async () => {
    const airmen = await airmanRepository.findBySiteId(14);

    subject = mount(
      <MissionPlannerRoster airmen={airmen}/>
    );
  });

  it('should render a row for each airman', () => {
    expect(subject.find(StyledRow).length).toBe(10);
  });
});