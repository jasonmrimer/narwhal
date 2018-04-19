import * as React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { MissionPlanner } from './MissionPlanner';
import { CrewModelFactory } from './factories/CrewModelFactory';
import { Link } from 'react-router-dom';
import { DoubleRepositories } from '../utils/Repositories';
import { StyledLoadingOverlay } from '../widgets/LoadingOverlay';
import { ProfileSitePickerStore } from '../profile/stores/ProfileSitePickerStore';
import { StyledCrew } from './Crew';
import { StyledMissionPlannerRosterContainer } from './MissionPlannerRosterContainer';
import { MissionPlannerStore } from './stores/MissionPlannerStore';
import { StyledLocationFilters } from '../widgets/LocationFilters';
import { StyledSubmitButton } from '../widgets/SubmitButton';
import { StyledForm } from '../widgets/Form';
import { eventStub } from '../utils/testUtils';
import { StyledButton } from '../widgets/Button';

describe('MissionPlanner', () => {
  let subject: ShallowWrapper;
  let profileStore: ProfileSitePickerStore;
  let missionPlannerStore: MissionPlannerStore;
  let windowPrintFunction: any;

  const crewModel = CrewModelFactory.build();
  const mission = crewModel.mission;

  beforeEach(async () => {
    windowPrintFunction = window.print;
    window.print = jest.fn();

    profileStore = new ProfileSitePickerStore(DoubleRepositories);
    await profileStore.hydrate();

    missionPlannerStore = new MissionPlannerStore(DoubleRepositories, profileStore);
    await missionPlannerStore.hydrate(1);

    subject = shallow(
      <MissionPlanner
        crewId={crewModel.id}
        missionPlannerStore={missionPlannerStore}
      />
    );
  });

  afterEach(() => {
    window.print = windowPrintFunction;
  });

  it('displays the mission details', () => {
    subject.update();
    expect(subject.text()).toContain(mission.atoMissionNumber);
    expect(subject.text()).toContain(`MSN DATE: ${mission.displayDateZulu}`);
    expect(subject.text()).toContain(`MSN START: ${mission.displayStartTime}`);
    expect(subject.text()).toContain(`MSN END: ${mission.displayEndTime}`);
    expect(subject.text()).toContain(`Last updated ${mission.displayUpdatedAt}.`);
  });

  it('should render the spinner only while loading', async () => {
    missionPlannerStore.setLoading(false);
    subject.update();
    expect(subject.find(StyledLoadingOverlay).exists()).toBeFalsy();

    missionPlannerStore.setLoading(true);
    subject.update();
    expect(subject.find(StyledLoadingOverlay).exists()).toBeTruthy();
  });

  it('renders a link back to Tracker', () => {
    expect(subject.find(Link).exists()).toBeTruthy();
    expect(subject.find(Link).prop('to')).toBe('/');
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

  it('should open print window when print button is clicked', () => {
    const printButton = subject.find(StyledButton).findWhere(elem => elem.prop('text') === 'PRINT');
    printButton.simulate('click');
    expect(window.print).toHaveBeenCalled();
  });

  it('should call crewStore save onSubmit', () => {
    missionPlannerStore.crewStore.save = jest.fn();
    subject.setProps({'missionPlannerStore': missionPlannerStore});
    subject.find(StyledForm).simulate('submit', eventStub);
    expect(missionPlannerStore.crewStore.save).toHaveBeenCalled();
  });

});
