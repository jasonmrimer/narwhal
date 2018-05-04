import * as React from 'react';
import { MissionPlannerRoster } from './MissionPlannerRoster';
import { mount, ReactWrapper } from 'enzyme';
import { CrewModelFactory } from './factories/CrewModelFactory';
import { StyledRosterSubHeaderRow } from '../widgets/RosterSubHeaderRow';
import { MissionPlannerStore } from './stores/MissionPlannerStore';
import { CrewStore } from './stores/CrewStore';
import { LocationFilterStore } from '../widgets/stores/LocationFilterStore';
import { RosterHeaderStore } from '../roster/stores/RosterHeaderStore';
import { DoubleRepositories } from '../utils/Repositories';
import { MissionModelFactory } from '../mission/factories/MissionModelFactory';
import { AirmanModelFactory } from '../airman/factories/AirmanModelFactory';
import { EventModelFactory } from '../event/factories/EventModelFactory';
import { SiteModelFactory } from '../site/factories/SiteModelFactory';
import { CertificationModelFactory } from '../skills/factories/CertificationModelFactory';
import { QualificationModelFactory } from '../skills/factories/QualificationModelFactory';
import { AirmanModel } from '../airman/models/AirmanModel';
import { MissionPlannerActions } from './MissionPlannerActions';
import { CrewModel } from './models/CrewModel';
import { StyledMissionPlannerRosterRow } from './MissionPlannerRosterRow';

describe('MissionPlannerRoster', () => {
  let subject: ReactWrapper;
  let missionPlannerStore: MissionPlannerStore;
  let crewStore: CrewStore;
  let locationFilterStore: LocationFilterStore;
  let rosterHeaderStore: RosterHeaderStore;
  let missionPlannerActions: MissionPlannerActions;
  let airman: AirmanModel;
  let crew: CrewModel;

  beforeEach(async () => {
    const site = SiteModelFactory.build(1, 2);
    const mission = MissionModelFactory.build();
    crew = CrewModelFactory.build();
    airman = AirmanModelFactory.build(3);

    const airmen = [crew.crewPositions[0].airman, crew.crewPositions[1].airman, airman];

    missionPlannerStore = new MissionPlannerStore(DoubleRepositories);
    crewStore = new CrewStore(DoubleRepositories);
    locationFilterStore = new LocationFilterStore();
    rosterHeaderStore = new RosterHeaderStore();

    crewStore.setNewEntry = jest.fn();
    crewStore.save = jest.fn();

    let event = EventModelFactory.build();
    event.airmanId = 2;

    missionPlannerStore.hydrate(mission, airmen, [EventModelFactory.build(), event]);
    crewStore.hydrate(crew, [airman]);
    locationFilterStore.hydrate(site.id, [site]);
    rosterHeaderStore.hydrate(
      site.id,
      CertificationModelFactory.buildList(3, site.id),
      QualificationModelFactory.buildList(3)
    );

    missionPlannerActions = new MissionPlannerActions(
      {crewStore, locationFilterStore, missionPlannerStore}
    );

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
    expect(subject.find(StyledMissionPlannerRosterRow).length).toBe(3);
  });

  it('should render a header row available and unavailable', () => {
    expect(subject.find(StyledRosterSubHeaderRow).length).toBe(2);
  });

  it('should render the available sub header before the unavailable', () => {
    expect(subject.find(StyledRosterSubHeaderRow).at(0).text()).toContain('AVAILABLE FOR MISSION ON');
    expect(subject.find(StyledRosterSubHeaderRow).at(1).text()).toContain('UNAVAILABLE FOR MISSION ON');
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
    const assignedAirmanRow = subject.find('.airman-row').at(1);
    expect(assignedAirmanRow.prop('onClick')).toBeUndefined();
  });
});