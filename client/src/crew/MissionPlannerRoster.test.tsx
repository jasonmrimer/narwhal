import * as React from 'react';
import { MissionPlannerRoster, StyledRow, StyledSubHeaderRow } from './MissionPlannerRoster';
import { mount, ReactWrapper } from 'enzyme';
import { FakeAirmanRepository } from '../airman/repositories/doubles/FakeAirmanRepository';
import { MissionModelFactory } from '../mission/factories/MissionModelFactory';

describe('MissionPlannerRoster', () => {
  let subject: ReactWrapper;
  const airmanRepository = new FakeAirmanRepository();

  beforeEach(async () => {
    const airmen = await airmanRepository.findBySiteId(14);

    subject = mount(
      <MissionPlannerRoster
        availableAirmen={airmen.slice(0, 5)}
        unavailableAirmen={airmen.slice(5)}
        mission={MissionModelFactory.build()}
      />
    );
  });

  it('should render a row for each airman', () => {
    expect(subject.find(StyledRow).length).toBe(10);
  });

  it('should render a header row available and unavailable', () => {
    expect(subject.find(StyledSubHeaderRow).length).toBe(2);
  });

  it('should render the available sub header before the unavailable', () => {
    expect(subject.find(StyledSubHeaderRow).at(0).text()).toContain('PERSONNEL BELOW ARE AVAILABLE FOR MISSION ON');
    expect(subject.find(StyledSubHeaderRow).at(1).text()).toContain('PERSONNEL BELOW ARE UNAVAILABLE FOR MISSION ON');
  });
});