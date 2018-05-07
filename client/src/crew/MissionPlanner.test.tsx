import * as React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { CrewModelFactory } from './factories/CrewModelFactory';
import { StyledLoadingOverlay } from '../widgets/LoadingOverlay';
import { StyledLocationFilters } from '../widgets/LocationFilters';
import { StyledCrew } from './Crew';
import { StyledMissionPlannerRosterContainer } from './MissionPlannerRosterContainer';
import { StyledSubmitButton } from '../widgets/SubmitButton';
import { StyledButton } from '../widgets/Button';
import { StyledForm } from '../widgets/Form';
import { eventStub } from '../utils/testUtils';
import { StyledNavigationBackButton } from '../widgets/NavigationBackButton';
import { LocationFilterStore } from '../widgets/stores/LocationFilterStore';
import { MissionPlannerStore } from './stores/MissionPlannerStore';
import { CrewStore } from './stores/CrewStore';
import { MissionPlanner } from './MissionPlanner';
import { DoubleRepositories } from '../utils/Repositories';
import { MissionPlannerActions } from './MissionPlannerActions';

describe('MissionPlanner', () => {
  let subject: ShallowWrapper;
  let missionPlannerStore: MissionPlannerStore;
  let locationFilterStore: LocationFilterStore;
  let crewStore: CrewStore;
  let missionPlannerActions: MissionPlannerActions;
  const crewModel = CrewModelFactory.build();
  const mission = crewModel.mission;

  beforeEach(async () => {
    missionPlannerStore = new MissionPlannerStore(DoubleRepositories);
    locationFilterStore = new LocationFilterStore();
    crewStore = new CrewStore(DoubleRepositories);

    missionPlannerStore.hydrate(crewModel.mission, [], []);
    crewStore.hydrate(crewModel, []);

    missionPlannerActions = new MissionPlannerActions(
      {crewStore, locationFilterStore, missionPlannerStore}
    );

    missionPlannerActions.submitAndPrint = jest.fn();
    missionPlannerActions.submit = jest.fn();
    subject = shallow(
      <MissionPlanner
        missionPlannerStore={missionPlannerStore}
        locationFilterStore={locationFilterStore}
        crewStore={crewStore}
        missionPlannerActions={missionPlannerActions}
      />
    );
  });

  it('displays the mission details', () => {
    expect(subject.text()).toContain(mission.atoMissionNumber);
    expect(subject.text()).toContain(`CORE SITE: ${mission.site!.name}`);
    expect(subject.text()).toContain(`MSN DATE: ${mission.displayDateZulu}`);
    expect(subject.text()).toContain(`MSN START: ${mission.displayStartTime}`);
    expect(subject.text()).toContain(`MSN END: ${mission.displayEndTime}`);
    expect(subject.text()).toContain(`Last updated ${mission.displayUpdatedAt}.`);
  });

  it('should render the spinner only while loading', () => {
    expect(subject.find(StyledLoadingOverlay).exists()).toBeFalsy();

    missionPlannerStore.setLoading(true);
    subject.instance().forceUpdate();
    subject.update();
    expect(subject.find(StyledLoadingOverlay).exists()).toBeTruthy();
  });

  it('renders a navigation back button to the Tracker', () => {
    expect(subject.find(StyledNavigationBackButton).exists()).toBeTruthy();
    expect(subject.find(StyledNavigationBackButton).prop('location')).toBe('/');
  });

  it('should render location filters', () => {
    expect(subject.find(StyledLocationFilters).exists()).toBeTruthy();
  });

  it('should render a crew', () => {
    expect(subject.find(StyledCrew).exists()).toBeTruthy();
  });

  it('should render a roster', () => {
    expect(subject.find(StyledMissionPlannerRosterContainer).exists()).toBeTruthy();
  });

  it('should render a save button', () => {
    expect(subject.find(StyledSubmitButton).length).toBe(1);
  });

  it('should render a print button', () => {
    expect(subject.find(StyledButton).prop('text')).toBe('PRINT');
  });

  it('should save the current crew and open print window when print button is clicked', () => {
    const printButton = subject.find(StyledButton).findWhere(elem => elem.prop('text') === 'PRINT');
    printButton.simulate('click');
    expect(missionPlannerActions.submitAndPrint).toHaveBeenCalled();
  });

  it('should call crewStore save onSubmit', () => {
    subject.find(StyledForm).simulate('submit', eventStub);
    expect(missionPlannerActions.submit).toHaveBeenCalled();
  });
});
