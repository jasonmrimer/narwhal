import * as React from 'react';
import MissionRepository from '../mission/repositories/MissionRepository';
import { MissionModel } from '../mission/models/MissionModel';
import Mission from '../mission/Mission';
import styled from 'styled-components';
import TopBar from '../widgets/TopBar';
import Filter from '../widgets/Filter';
import FilterOption from '../widgets/models/FilterOptionModel';
import SiteRepository from '../site/repositories/SiteRepository';
import SiteModel from '../site/models/SiteModel';
import { default as createDefaultOption, DefaultValue } from '../utils/createDefaultOption';

interface Props {
  missionRepository: MissionRepository;
  siteRepository: SiteRepository;
  username: string;
  className?: string;
}

interface State {
  missions: MissionModel[];
  sites: SiteModel[];
  selectedSiteId: number;
}

export class Dashboard extends React.Component<Props, State> {
  readonly defaultSiteOption: DefaultValue = createDefaultOption('All Sites');

  constructor(props: Props) {
    super(props);
    this.state = {
      missions: [],
      sites: [],
      selectedSiteId: this.defaultSiteOption.value
    };
  }

  async componentDidMount() {
    const missions = await this.props.missionRepository.findAll();
    const sites = await this.props.siteRepository.findAll();

    this.setState({missions, sites});
  }

  setSelectedSiteId = async (option: FilterOption) => {
    const updatedDashboard = (option.value === this.defaultSiteOption.value) ?
      await this.props.missionRepository.findAll() :
      await this.props.missionRepository.findBySite(option.value);

    this.setState({selectedSiteId: option.value, missions: updatedDashboard});
  }

  render() {
    const options = this.state.sites.map((site: SiteModel) => {
      return {value: site.id, text: site.name};
    });
    return (
      [
        <TopBar key="0" username={this.props.username} pageTitle="MPS DASHBOARD"/>,
        (
          <div key="1" className={`${this.props.className} filter`}>
            <div className="filter">
              <Filter
                id="site-filter"
                defaultOption={this.defaultSiteOption}
                options={options}
                callback={this.setSelectedSiteId}
              />
            </div>
          </div>),
        (
          <div key="2" className={`${this.props.className} missions`}>
            {this.state.missions.map((mission: MissionModel, index) => {
              return <Mission mission={mission} key={index}/>;
            })}
          </div>)
      ]
    );
  }
}

export default styled(Dashboard)`
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;

  .filter {
    min-width: 40%;
    padding-left: calc(1% / 1);
    padding-top: 0.75rem;
    padding-bottom: 2.5rem;
  }
`;