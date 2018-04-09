import * as React from 'react';
import { MissionPlanner } from './MissionPlanner';
import { mount, ReactWrapper } from 'enzyme';
import { DoubleRepositories } from '../Repositories';
import { ProfileSitePickerStore } from '../profile/stores/ProfileSitePickerStore';
import { MissionPlannerStore } from './stores/MissionPlannerStore';
import { Crew } from './Crew';
import { Theme } from '../themes/default';
import { MemoryRouter } from 'react-router';
import { ThemeProvider } from 'styled-components';
import { forIt } from '../utils/testUtils';
import { Button } from '../widgets/Button';
import { MissionPlannerRoster, Row } from './MissionPlannerRoster';
import { RosterHeader } from '../roster/RosterHeader';

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

    const certification = missionPlannerStore.airmen[0].certifications[0].certification;
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
    const airman = missionPlannerStore.airmen[0];
    missionPlannerStore.crewStore.setNewEntry(
      {
        airmanName: `${airman.lastName}, ${airman.firstName}`,
        title: '',
        critical: false
      });

    subject.find(Button).simulate('click');
    expect(subject.find(Crew).prop('crewStore').crew!.crewPositions[2].airman).toBe(airman);
  });

});