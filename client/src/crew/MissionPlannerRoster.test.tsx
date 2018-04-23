import * as React from 'react';
import {
  CrewStoreContract,
  LocationFilterStoreContract,
  MissionPlannerRoster,
  MissionPlannerStoreContract,
  RosterHeaderStoreContract,
  StyledRow,
  StyledSubHeaderRow
} from './MissionPlannerRoster';
import { mount, ReactWrapper } from 'enzyme';
import { CrewModelFactory } from './factories/CrewModelFactory';
import { AirmanModel } from '../airman/models/AirmanModel';

describe('MissionPlannerRoster', () => {
  let subject: ReactWrapper;
  let missionPlannerStore: MissionPlannerStoreContract;
  let crewStore: CrewStoreContract;
  let locationFilterStore: LocationFilterStoreContract;
  let rosterHeaderStore: RosterHeaderStoreContract;

  beforeEach(async () => {
    missionPlannerStore = {
      availableAirmen: [new AirmanModel(1, 1, 1, 1, 'First', 'Last', [], [])],
      unavailableAirmen: []
    };

    crewStore = {
      crew: CrewModelFactory.build(1),
    };

    locationFilterStore = {
      filterAirmen: (airmen: AirmanModel[]) => airmen,
    };

    rosterHeaderStore = {
      filterAirmen: (airmen: AirmanModel[]) => airmen,
    };

    subject = mount(
      <MissionPlannerRoster
        missionPlannerStore={missionPlannerStore}
        crewStore={crewStore}
        locationFilterStore={locationFilterStore}
        rosterHeaderStore={rosterHeaderStore}
      />
    );
  });

  it('should render a row for each airman', () => {
    expect(subject.find(StyledRow).length).toBe(1);
  });

  it('should render a header row available and unavailable', () => {
    expect(subject.find(StyledSubHeaderRow).length).toBe(2);
  });

  it('should render the available sub header before the unavailable', () => {
    expect(subject.find(StyledSubHeaderRow).at(0).text()).toContain('PERSONNEL BELOW ARE AVAILABLE FOR MISSION ON');
    expect(subject.find(StyledSubHeaderRow).at(1).text()).toContain('PERSONNEL BELOW ARE UNAVAILABLE FOR MISSION ON');
  });
});