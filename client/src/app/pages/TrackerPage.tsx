import * as React from 'react';
import { StyledTopBar } from '../../widgets/TopBar';
import { ProfileSitePickerStore } from '../../profile/stores/ProfileSitePickerStore';
import { inject, observer } from 'mobx-react';
import { StyledTracker } from '../../tracker/Tracker';
import { TrackerStore } from '../../tracker/stores/TrackerStore';
import { WebRepositories } from '../../utils/Repositories';
import { PlannerStore } from '../../roster/stores/PlannerStore';
import { LocationFilterStore } from '../../widgets/stores/LocationFilterStore';
import { RosterHeaderStore } from '../../roster/stores/RosterHeaderStore';
import { MissionFormStore } from '../../event/stores/MissionFormStore';
import { SkillFormStore } from '../../skills/stores/SkillFormStore';

interface Props {
  profileStore?: ProfileSitePickerStore;
  trackerStore?: TrackerStore;
  missionFormStore?: MissionFormStore;
  skillFormStore?: SkillFormStore;
  plannerStore?: PlannerStore;
  locationFilterStore?: LocationFilterStore;
  rosterHeaderStore?: RosterHeaderStore;
}

@inject(
  'trackerStore',
  'missionFormStore',
  'profileStore',
  'plannerStore',
  'locationFilterStore',
  'rosterHeaderStore',
  'skillFormStore'
)
@observer
export class TrackerPage extends React.Component<Props> {
  async componentDidMount() {
    const week = this.props.plannerStore!.plannerWeek;
    const siteId = this.props.profileStore!.profile!.siteId!;

    const [airmen, events, , certifications, qualifications, missions, sites] = await Promise.all([
      WebRepositories.airmanRepository.findBySiteId(siteId),
      WebRepositories.eventRepository.findAllBySiteIdAndWithinPeriod(siteId, week[0], week[6]),
      WebRepositories.siteRepository.findAll(),
      WebRepositories.skillRepository.findAllCertifications(),
      WebRepositories.skillRepository.findAllQualifications(),
      WebRepositories.missionRepository.findAll(),
      WebRepositories.siteRepository.findAll()
    ]);

    this.props.trackerStore!.hydrate(airmen, events, siteId);
    this.props.locationFilterStore!.hydrate(siteId, sites);
    this.props.rosterHeaderStore!.hydrate(siteId, certifications, qualifications);
    this.props.skillFormStore!.hydrate(certifications, qualifications, siteId);
    this.props.missionFormStore!.hydrate(missions);
  }

  render() {
    const {profileStore} = this.props;
    const {profile} = profileStore!;
    return (
      <React.Fragment>
        <StyledTopBar/>
        <StyledTracker profile={profile!}/>
      </React.Fragment>
    );

  }
}