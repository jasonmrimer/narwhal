import * as React from 'react';
import { StyledMissionPlanner } from '../../crew/MissionPlanner';
import { inject, observer } from 'mobx-react';
import { StyledTopBar } from '../../widgets/TopBar';
import { WebRepositories } from '../../utils/Repositories';
import { MissionPlannerStore } from '../../crew/stores/MissionPlannerStore';
import { RosterHeaderStore } from '../../roster/stores/RosterHeaderStore';
import { LocationFilterStore } from '../../widgets/stores/LocationFilterStore';
import { CrewStore } from '../../crew/stores/CrewStore';
import { ProfileSitePickerStore } from '../../profile/stores/ProfileSitePickerStore';

interface Props {
  missionPlannerStore?: MissionPlannerStore;
  rosterHeaderStore?: RosterHeaderStore;
  locationFilterStore?: LocationFilterStore;
  crewStore?: CrewStore;
  profileStore?: ProfileSitePickerStore;
  crewId: number;
}

@inject(
  'missionPlannerStore',
  'rosterHeaderStore',
  'locationFilterStore',
  'crewStore',
  'profileStore',
)
@observer
export class CrewPage extends React.Component<Props> {
  async componentDidMount() {
    const {
      profileStore,
      crewId,
      locationFilterStore,
      rosterHeaderStore,
      missionPlannerStore,
      crewStore
    } = this.props;

    const [crew, airmen, certifications, qualifications, sites] = await Promise.all([
      WebRepositories.crewRepository.findOne(crewId),
      WebRepositories.airmanRepository.findBySiteId(profileStore!.profile!.siteId!),
      WebRepositories.skillRepository.findAllCertifications(),
      WebRepositories.skillRepository.findAllQualifications(),
      WebRepositories.siteRepository.findAll()
    ]);

    const events = await WebRepositories.eventRepository.findAllBySiteIdAndWithinPeriod(
      profileStore!.profile!.siteId!,
      crew.mission.startDateTime,
      crew.mission.endDateTime || crew.mission.startDateTime.clone().add(12, 'hours')
    );

    locationFilterStore!.hydrate(profileStore!.profile!.siteId!, sites);
    rosterHeaderStore!.hydrate(profileStore!.profile!.siteId!, certifications, qualifications);
    missionPlannerStore!.hydrate(crew.mission, airmen, events);
    crewStore!.hydrate(crew, airmen);
  }

  render() {
    return (
      <React.Fragment>
        <StyledTopBar/>
        <StyledMissionPlanner />
      </React.Fragment>
    );
  }
}