import * as React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { MissionPlanner } from './MissionPlanner';
import { CrewModelFactory } from './factories/CrewModelFactory';
import { StyledButton } from '../widgets/Button';
import { Link } from 'react-router-dom';
import { DoubleRepositories } from '../utils/Repositories';
import { StyledLoadingOverlay } from '../widgets/LoadingOverlay';
import { ProfileSitePickerStore } from '../profile/stores/ProfileSitePickerStore';
import { StyledCrew } from './Crew';
import { StyledMissionPlannerRosterContainer } from './MissionPlannerRosterContainer';
import { MissionPlannerStore } from './stores/MissionPlannerStore';
import { StyledLocationFilters } from '../widgets/LocationFilters';

describe('MissionPlanner', () => {
  let subject: ShallowWrapper;
  let profileStore: ProfileSitePickerStore;
  let missionPlannerStore: MissionPlannerStore;

  const crewModel = CrewModelFactory.build();
  const mission = crewModel.mission;

  beforeEach(async () => {
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

  it('displays the mission details', () => {
    subject.update();
    expect(subject.text()).toContain(mission.atoMissionNumber);
    expect(subject.text()).toContain(`MSN DATE ${mission.displayDate}`);
    expect(subject.text()).toContain(`MSN START ${mission.displayStartTime}`);
    expect(subject.text()).toContain(`MSN END ${mission.displayEndTime}`);
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
    expect(subject.find(StyledButton).length).toBe(1);
  });
});
