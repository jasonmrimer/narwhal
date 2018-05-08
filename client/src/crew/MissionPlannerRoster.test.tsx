import * as React from 'react';
import { MissionPlannerRoster } from './MissionPlannerRoster';
import { mount, ReactWrapper } from 'enzyme';
import { CrewModelFactory } from './factories/CrewModelFactory';
import { StyledRosterSubHeaderRow } from '../widgets/RosterSubHeaderRow';
import { AirmanModelFactory } from '../airman/factories/AirmanModelFactory';
import { AirmanModel } from '../airman/models/AirmanModel';
import { MissionPlannerActions } from './MissionPlannerActions';
import { MissionPlannerRosterRow, StyledMissionPlannerRosterRow } from './MissionPlannerRosterRow';
import { StyledNotification } from '../widgets/Notification';
import { EmptyNotification } from './models/MissionPlannerRosterList';

describe('MissionPlannerRoster', () => {
  let airman: AirmanModel;
  let missionPlannerStore: any;
  let crewStore: any;
  let subject: ReactWrapper;

  beforeEach(async () => {
    const crew = CrewModelFactory.build();

    airman = AirmanModelFactory.build(10);

    missionPlannerStore = {
      availableAirmen: [airman],
      unavailableAirmen: [crew.crewPositions[0].airman],
      refreshAllEvents: jest.fn()
    };

    crewStore = {
      crew: crew,
      setNewEntry: jest.fn(),
      save: jest.fn()
    };

    const locationFilterStore: any = {
      filterAirmen: (airmen: AirmanModel[]) => airmen
    };

    const rosterHeaderStore: any = {
      filterAirmen: (airmen: AirmanModel[]) => airmen
    };

    const missionPlannerActions = new MissionPlannerActions({
      missionPlannerStore,
      crewStore,
      locationFilterStore
    });

    subject = mount(
      <MissionPlannerRoster
        missionPlannerStore={missionPlannerStore}
        crewStore={crewStore}
        locationFilterStore={locationFilterStore}
        rosterHeaderStore={rosterHeaderStore}
        missionPlannerActions={missionPlannerActions}
      />
    );
  });

  it('should render a row for each airman', () => {
    expect(subject.find(StyledMissionPlannerRosterRow).length).toBe(2);
  });

  it('should render a header row available and unavailable', () => {
    expect(subject.find(StyledRosterSubHeaderRow).length).toBe(2);
  });

  it('should render a message if no there are no available airmen', () => {
    missionPlannerStore.availableAirmen = [];
    missionPlannerStore.unavailableAirmen = [];

    subject.instance().forceUpdate();
    subject.update();

    expect(subject.find(StyledNotification).at(0).text()).toContain(EmptyNotification.NoneAvailable().text);
    expect(subject.find(StyledNotification).at(1).text()).toContain(EmptyNotification.NoneAssigned().text);
  });

  it('should render the available sub header before the unavailable', () => {
    expect(subject.find(StyledRosterSubHeaderRow).at(0).text()).toContain('AVAILABLE');
    expect(subject.find(StyledRosterSubHeaderRow).at(1).text()).toContain('UNAVAILABLE');
  });

  it('should call CrewStore set new entry when one clicks on an airman row', () => {
    subject.find('.airman-row').at(0).simulate('click');
    expect(crewStore.setNewEntry).toHaveBeenCalledWith({airmanName: `${airman.lastName}, ${airman.firstName}`});
  });

  it('should call CrewStore save when one clicks on an airman row', () => {
    subject.find('.airman-row').at(0).simulate('click');
    expect(crewStore.save).toHaveBeenCalled();
  });

  it('should not be able to click on an airman assigned to the crew', () => {
    const assignedAirmanRow = subject.find(MissionPlannerRosterRow).at(1);
    expect(assignedAirmanRow.prop('onCrew')).toBeTruthy();
  });
});