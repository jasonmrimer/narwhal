import * as React from 'react';
import { MissionModel } from '../mission/models/MissionModel';
import * as classNames from 'classnames';
import { StyledMission } from '../mission/Mission';
import styled from 'styled-components';
import { observer } from 'mobx-react';

interface Props {
  missions: MissionModel[];
  header: string;
  className?: string;
}

@observer
export class MissionCardSection extends React.Component<Props> {
  render() {
    const count = this.props.missions.length;

    return (
      <div className={classNames(this.props.className, 'section')}>
        <h2>
          <span>
            <span className="title">{this.props.header}</span>
            <span className="count">{count}</span>
          </span>
        </h2>
        <div className="cards">
          {
            this.props.missions.map((mission: MissionModel, index) => {
              return <StyledMission mission={mission} key={index}/>;
            })
          }
        </div>
      </div>
    );
  }
}

export const StyledMissionCardSection = styled(MissionCardSection)`
padding-top: 1rem;

  h2 {
    text-align: center; 
    font-weight: 300; 
    width: 100%; 
    margin: 10px 0 20px;
    line-height: 0.125rem;
    border-bottom: 1px solid #fff; 
  } 
  
  h2 span { 
    background: ${props => props.theme.dark}; 
    vertical-align: middle;
    padding:  0 3rem; 
  }
  
  .count {
    margin-left: 0.75rem;
    padding: 0.25rem 1rem;
    border: 1px solid #fff;
    border-radius: 2px; 
    font-size: 0.9rem;
  }
  
  .title {
    padding: 0;
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