import * as React from 'react';
import { MissionModel } from '../mission/models/MissionModel';
import { Moment } from 'moment';
import * as classNames from 'classnames';
import { StyledMission } from '../mission/Mission';
import styled from 'styled-components';

interface Props {
  missions: MissionModel[],
  header: string,
  intervalStart: Moment,
  intervalEnd: Moment,
  className?: string,
}

function renderFilteredMissions(missions: MissionModel[], startTime: Moment, endTime: Moment) {
  const filteredMissions = missions.filter((mission) =>
    mission.startDateTime.isBetween(startTime, endTime, 'minute', '[)'));

  return filteredMissions.map((mission: MissionModel, index) => {
    return <StyledMission mission={mission} key={index}/>;
  });
}

export class MissionCardSection extends React.Component<Props> {
  render() {
    return (
      <div className={classNames(this.props.className, 'section')}>
        <h2><span>{this.props.header}</span></h2>
        <div className="cards">
          {renderFilteredMissions(this.props.missions, this.props.intervalStart, this.props.intervalEnd)}
        </div>
      </div>
    );
  }
}

export const StyledMissionCardSection = styled(MissionCardSection)`
  h2 {
    width: 100%; 
    text-align: center; 
    border-bottom: 1px solid #fff; 
    line-height: 0.1em;
    margin: 10px 0 20px;
    font-weight: 300; 
  } 
  
  h2 span { 
    background: ${props => props.theme.dark}; 
    padding:  0 3rem; 
  }
  
  .section {
    display: flex;
    flex-direction: column;
    padding: 2rem;
    max-width: 100%;
    min-width: 1000px;
  }
  
  .cards {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
  }
`;