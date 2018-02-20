import * as React from 'react';
import styled from 'styled-components';
import { CrewStore } from './stores/CrewStore';
import { observer } from 'mobx-react';
import { CrewPositionModel } from './models/CrewPositionModel';

interface Props {
  crewId: number;
  crewStore: CrewStore;
  className?: string;
}

@observer
export class Crew extends React.Component<Props> {
  async componentDidMount() {
    await this.props.crewStore.setCrewId(this.props.crewId);
  }

  render() {
    const crew = this.props.crewStore.crew;
    if (crew == null) {
      return null;
    }

    return (
      <div className={this.props.className}>
        <div className="mission-details">
          <h1>{crew.mission.atoMissionNumber}</h1>
          <span>MSN DATE {crew.mission.displayDate}</span>
          <span>MSN START {crew.mission.displayStartTime}</span>
          <span>MSN END {crew.mission.displayEndTime}</span>
        </div>
        <table>
          <thead>
            <tr>
              <td>ASSIGNED CREW MEMBER</td>
            </tr>
          </thead>
          <tbody>
          {this.renderCrew(crew.crewPositions)}
          </tbody>
        </table>
      </div>
    );
  }

  private renderCrew(crewPositions: CrewPositionModel[]) {
    return crewPositions.map((crewPosition: CrewPositionModel, index: number) => {
      return (
        <tr key={index}>
          <td>{crewPosition.airman.lastName}</td>
        </tr>
      );
    });
  }
}

export const StyledCrew = styled(Crew)`
  margin-left: 3rem;
  
  .mission-details {
    margin-bottom: 3rem;
  }
  
  span {
    margin-right: 1.5rem;
  }
  
  table { 
    border: 1px solid ${props => props.theme.graySteel};
    border-collapse: collapse;
    background-color: ${props => props.theme.dark};
    width: 80%;
  }
  
  caption {
    display: none;
  }
  
  thead {
    background-color: ${props => props.theme.lighter};
    text-align: left;
    vertical-align: top;
    
    th {
      font-size: 0.875rem;
      font-weight: 500;
      font-weight: normal;
    }
  }
   
  tbody tr:nth-child(even) {
    background-color: ${props => props.theme.light};
  }
  
  td, 
  th {
    padding: 0.75rem;
  }
`;