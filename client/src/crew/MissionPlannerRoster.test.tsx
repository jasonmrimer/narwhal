import * as React from 'react';
import { StyledMissionPlannerRoster } from './MissionPlannerRoster';
import { mount, ReactWrapper } from 'enzyme';
import { CrewModelFactory } from './factories/CrewModelFactory';
import { StyledRosterSubHeaderRow } from '../widgets/RosterSubHeaderRow';
import { AirmanModelFactory } from '../airman/factories/AirmanModelFactory';
import { AirmanModel } from '../airman/models/AirmanModel';
import { MissionPlannerActions } from './MissionPlannerActions';
import { StyledMissionPlannerRosterRow } from './MissionPlannerRosterRow';
import { StyledNotification } from '../widgets/Notification';
import { EmptyNotification } from './models/MissionPlannerRosterList';
import { MemoryRouter } from 'react-router';
import { Provider } from 'mobx-react';

describe('MissionPlannerRoster', () => {
  let airman: AirmanModel;
  let missionPlannerStore: any;
  let skillsFieldStore: any;
  let crewStore: any;
  let subject: ReactWrapper;
  let locationFilterStore: any;
  let rosterHeaderStore: any;
  let missionPlannerActions: any;

  beforeEach(async () => {
    const crew = CrewModelFactory.build();

    airman = AirmanModelFactory.build(10);

    missionPlannerStore = {
      availableAirmen: [airman],
      unavailableAirmen: [crew.crewPositions[0].airman],
      refreshAllEvents: jest.fn(),
      performLoading: jest.fn()
    };

    skillsFieldStore = {
      isCloseToExpiration: () => false,
      isExpired: () => false
    };

    crewStore = {
      crew: crew,
      setNewEntry: jest.fn(),
      save: jest.fn(),
      hasAirman: jest.fn()
    };

    locationFilterStore = {
      filterAirmen: (airmen: AirmanModel[]) => airmen
    };

    rosterHeaderStore = {
      filterAirmen: (airmen: AirmanModel[]) => airmen
    };

    missionPlannerActions = new MissionPlannerActions({
      missionPlannerStore,
      crewStore,
      locationFilterStore
    });

    subject = mount(
            <MemoryRouter>
              <Provider
                        skillsFieldStore={skillsFieldStore}
                        missionPlannerStore={missionPlannerStore}
                        crewStore={crewStore}
                        locationFilterStore={locationFilterStore}
                        rosterHeaderStore={rosterHeaderStore}
                        missionPlannerActions={missionPlannerActions}
              >
                <StyledMissionPlannerRoster/>
              </Provider>
              </MemoryRouter>
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

    const updatedSubject = mount(
      <MemoryRouter>
        <Provider
          skillsFieldStore={skillsFieldStore}
          missionPlannerStore={missionPlannerStore}
          crewStore={crewStore}
          locationFilterStore={locationFilterStore}
          rosterHeaderStore={rosterHeaderStore}
          missionPlannerActions={missionPlannerActions}
        >
          <StyledMissionPlannerRoster/>
        </Provider>
      </MemoryRouter>
    );
    expect(updatedSubject.find(StyledNotification).at(0).text()).toContain(EmptyNotification.NoneAvailable().text);
    expect(updatedSubject.find(StyledNotification).at(1).text()).toContain(EmptyNotification.NoneAssigned().text);
  });

  it('should render the available sub header before the unavailable', () => {
    expect(subject.find(StyledRosterSubHeaderRow).at(0).text()).toContain('AVAILABLE');
    expect(subject.find(StyledRosterSubHeaderRow).at(1).text()).toContain('UNAVAILABLE');
  });

  it('should call CrewStore set new entry when one clicks on an airman row', () => {
    subject.find('.airman-row').at(0).simulate('click');
    expect(missionPlannerStore.performLoading).toHaveBeenCalled();
  });
});