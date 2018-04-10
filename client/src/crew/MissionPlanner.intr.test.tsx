import * as React from 'react';
import { MissionPlanner } from './MissionPlanner';
import { mount, ReactWrapper } from 'enzyme';
import { DoubleRepositories } from '../utils/Repositories';
import { ProfileSitePickerStore } from '../profile/stores/ProfileSitePickerStore';
import { MissionPlannerStore } from './stores/MissionPlannerStore';
import { Theme } from '../themes/default';
import { MemoryRouter } from 'react-router';
import { ThemeProvider } from 'styled-components';
import { forIt } from '../utils/testUtils';
import { MissionPlannerRoster, Row } from './MissionPlannerRoster';
import { RosterHeader } from '../roster/RosterHeader';
import { CrewPositionRow } from './CrewPositionRow';
import { Form } from '../widgets/Form';

describe('MissionPlanner', () => {
  let subject: ReactWrapper;
  let missionPlannerStore: MissionPlannerStore;
  let profileStore: ProfileSitePickerStore;

  beforeEach(async () => {
    profileStore = new ProfileSitePickerStore(DoubleRepositories);
    await profileStore.hydrate();

    missionPlannerStore = new MissionPlannerStore(DoubleRepositories, profileStore);
    await missionPlannerStore.hydrate(1);

    subject = mount(
      <ThemeProvider theme={Theme}>
        <MemoryRouter>
          <MissionPlanner
            crewId={1}
            missionPlannerStore={missionPlannerStore}
          />
        </MemoryRouter>
      </ThemeProvider>
    );
    await forIt();
    subject.update();
  });

  it('should render a mission planner roster', () => {
    expect(subject.find(MissionPlannerRoster).exists()).toBeTruthy();
  });

  it('should render a roster header that filters', () => {
    expect(subject.find(RosterHeader).exists()).toBeTruthy();

    const certification = missionPlannerStore.availableAirmen[0].certifications[0].certification;
    missionPlannerStore.rosterHeaderStore.setSelectedCertificationOptions([
      {
        value: certification.id,
        label: certification.title
      }
    ]);

    subject.update();
    expect(subject.find(Row).length).toBe(6);
  });

  it('submits crew positions on submitCrew', async () => {
    const airman = missionPlannerStore.availableAirmen[0];
    missionPlannerStore.crewStore.setNewEntry(
      {
        airmanName: `${airman.lastName}, ${airman.firstName}`,
        title: '',
        critical: false
      });

    await subject.find(Form).simulate('submit');

    expect(subject.find(CrewPositionRow).at(2).text()).toContain(`${airman.lastName}, ${airman.firstName}`);
  });

});