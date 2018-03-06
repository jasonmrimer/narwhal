import * as React from 'react';
import styled from 'styled-components';
import { CrewStore } from './stores/CrewStore';
import { observer } from 'mobx-react';
import { StyledTextInput } from '../widgets/TextInput';
import { StyledButton } from '../widgets/Button';
import { CrewPositionModel } from './models/CrewPositionModel';
import { StyledCheckbox } from '../widgets/Checkbox';
import { Link } from 'react-router-dom';
import { BackArrow } from '../icons/BackArrow';
import { Theme } from '../themes/default';

interface Props {
  crewId: number;
  crewStore: CrewStore;
  className?: string;
}

/*tslint:disable:no-any*/
@observer
export class Crew extends React.Component<Props> {
  async componentDidMount() {
    await this.props.crewStore.hydrate(this.props.crewId);
  }

  onChange = (e: any, id: number) => {
    this.props.crewStore.setCrewEntry(id, {[e.target.name]: e.target.value});
  }

  onCheck = (e: any, id: number) => {
    this.props.crewStore.setCrewEntry(id, {[e.target.name]: e.target.checked});
  }

  handleNewEntryChange = (e: any) => {
    this.props.crewStore.setNewEntry({[e.target.name]: e.target.value});
  }

  handleNewEntryCheck = (e: any) => {
    this.props.crewStore.setNewEntry({[e.target.name]: e.target.checked});
  }

  render() {
    const crew = this.props.crewStore.crew;
    if (crew == null) {
      return null;
    }

    return (
      <div className={this.props.className}>
        <Link to={`/`}>
          <BackArrow color={Theme.graySteel}/>
          <span>Back to Availability Roster</span>
        </Link>
        <div className="mission-details">
          <h1>{crew.mission.atoMissionNumber}</h1>
          <span>MSN DATE {crew.mission.displayDate}</span>
          <span>MSN START {crew.mission.displayStartTime}</span>
          <span>MSN END {crew.mission.displayEndTime}</span>
        </div>
        <StyledButton
          text="SAVE"
          onClick={this.props.crewStore.save}
        />
        <table>
          <thead>
          <tr>
            <td>CRITICAL</td>
            <td>POSITION</td>
            <td>ASSIGNED CREW MEMBER</td>
          </tr>
          </thead>
          <tbody>
          {this.renderCrew()}
          {this.renderCrewInput()}
          </tbody>
        </table>
      </div>
    );
  }

  private renderCrew = () => {
    const {crew} = this.props.crewStore;
    if (crew == null) {
      return [];
    }

    return crew.crewPositions.map((position: CrewPositionModel, index: number) => {
      return (
        <tr key={index}>
          <td>
            <label htmlFor={`critical-${index}`}>
              <StyledCheckbox
                id={`critical-${index}`}
                name="critical"
                onChange={(e) => this.onCheck(e, position.id!)}
                checked={position.critical}
              />
            </label>
          </td>
          <td>
            <StyledTextInput
              name="title"
              value={position.title}
              onChange={(e) => this.onChange(e, position.id!)}
            />
          </td>
          <td>
            {position.displayFullName}
          </td>
        </tr>
      );
    });
  }

  private renderCrewInput = () => {
    return (
      <tr>
        <td>
          <label htmlFor={`critical-new-entry`}>
            <StyledCheckbox
              id={`critical-new-entry`}
              name="critical"
              onChange={this.handleNewEntryCheck}
              checked={this.props.crewStore.newEntry.critical}
            />
          </label>
        </td>
        <td>
          <StyledTextInput
            name="title"
            onChange={this.handleNewEntryChange}
            value={this.props.crewStore.newEntry.title}
          />
        </td>
        <td>
          <StyledTextInput
            name="airmanName"
            onChange={this.handleNewEntryChange}
            onKeyPress={async (e) => {
              if (e.key === 'Enter') {
                await this.props.crewStore.save();
              }
            }}
            value={this.props.crewStore.newEntry.airmanName}
          />
        </td>
      </tr>
    );
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
      font-weight: 400;
    }
  }
   
  tbody tr:nth-child(even) {
    background-color: ${props => props.theme.light};
  }
  
  td, 
  th {
    padding: 0.75rem;
  }
  
  button {
    margin-bottom: 1.5rem;
  }
  
  a {
    text-decoration: none;
    font-size: 0.875rem;
    color: ${props => props.theme.graySteel};
    display: flex;
    justify-content: left;
    align-items: center;
    
    span {
      margin-left: 0.5rem;
    }
  }
`;