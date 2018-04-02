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
import { StyledLoadingOverlay } from '../widgets/LoadingOverlay';
import { StyledSingleTypeahead } from '../widgets/SingleTypeahead';
import { FilterOption } from '../widgets/models/FilterOptionModel';

interface Props {
  crewId: number;
  crewStore: CrewStore;
  className?: string;
}

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

  handleTypeahead = (opt: FilterOption) => {
    if (opt) {
      this.props.crewStore.setNewEntry({airmanName: opt.label});
    } else {
      this.props.crewStore.setNewEntry({airmanName: ''});
    }
  }

  handleDeleteChange = (e: any, id: number) => {
    this.props.crewStore.clearPosition(id);
  }

  render() {
    const {crewStore} = this.props;
    const crew = this.props.crewStore.crew;
    if (crew == null) {
      return null;
    }

    return (
      <div className={this.props.className}>
        {crewStore.loading && <StyledLoadingOverlay/>}
        <Link to="/">
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
        <div className="crew">
          <div className="header">
            <span className="critical">CRITICAL</span>
            <span className="position">POSITION</span>
            <span className="member">ASSIGNED CREW MEMBER</span>
          </div>
          <div className="crew-positions">
            {this.renderCrew()}
            {this.renderCrewInput()}
          </div>
        </div>
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
        <div key={index} className="crew-position">
          <span className="critical">
              <StyledCheckbox
                id={`critical-${index}`}
                name="critical"
                onChange={(e) => this.onCheck(e, position.id!)}
                checked={position.critical}
              />
          </span>
          <span className="position">
            <StyledTextInput
              name="title"
              value={position.title || ''}
              onChange={(e) => this.onChange(e, position.id!)}
            />
          </span>
          <span className="member">
            <span className="airman">{position.displayFullName}</span>
            {
              position.displayFullName !== '' &&
              <button onClick={(e) => this.handleDeleteChange(e, position.id!)}>×</button>
            }
          </span>
        </div>
      );
    });
  }

  private renderCrewInput = () => {
    const selectedAirmanOption = this.props.crewStore.airmenOptions.find(opt => {
      return opt.label === this.props.crewStore.newEntry.airmanName;
    });

    return (
      <div
        onKeyPress={async (e) => {
          if (e.key === 'Enter') {
            await this.props.crewStore.save();
          }
        }}
        className="crew-position"
      >
        <span className="critical">
          <label htmlFor={`critical-new-entry`}>
            <StyledCheckbox
              id={`critical-new-entry`}
              name="critical"
              onChange={this.handleNewEntryCheck}
              checked={this.props.crewStore.newEntry.critical}
            />
          </label>
        </span>
        <span className="position">
          <StyledTextInput
            name="title"
            onChange={this.handleNewEntryChange}
            value={this.props.crewStore.newEntry.title}
          />
        </span>
        <span className="member">
          <StyledSingleTypeahead
            className="airmanSelect"
            options={this.props.crewStore.airmenOptions}
            onChange={this.handleTypeahead}
            placeholder={''}
            selected={selectedAirmanOption ? selectedAirmanOption : {value: '', label: ''}}
            clearButton={!!selectedAirmanOption}
          />
        </span>
      </div>
    );
  }
}

export const StyledCrew = styled(Crew)`
  margin-left: 3rem;
  
  .mission-details {
    margin-bottom: 3rem;
    
    span {
      margin-right: 2rem;
    }
  }
  
  & > button {
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
  
  .rbt .rbt-input {
    box-sizing: border-box;
    padding: 0;
    
    input {
      font-weight: 300;
      font-family: 'Roboto', sans-serif;
    }
    
    .rbt-input-main {
      height: unset;
    }
  }
  
  .rbt .close {
    float: none;
    position: unset;
  }
  
  .crew {
    min-width: 800px;
    width: 80%;
    border: 1px solid ${props => props.theme.graySteel};
  }
  
  .header {
    display: flex;
    flex-direction: row;
    width: 100%;
    background: ${props => props.theme.lighter};
    padding: 0.75rem;
  }
  
  .crew-positions {
    display: flex;
    flex-direction: column;
    width: 100%;
  }
  
  .crew-position {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    padding: 0.75rem;
 
    .member {
      display: flex;
      justify-content: space-between;
      
      button {
        background: none;
        color: ${props => props.theme.fontColor};
        border: none;
        font-size: 1.25rem;
        font-weight: 300;
        padding: 0;
        cursor: pointer;
      }
    }
    
    &:nth-child(odd) {
      background: ${props => props.theme.dark};
    }
    
    &:nth-child(even) {
      background: ${props => props.theme.light};
    }
  }
  
  .critical {
    width: 10%;
    padding: 0 1rem 0 0;
  }
  
  .position {
    width: 40%;
    padding: 0 1rem 0 0;
  }
  
  .member {
    width: 50%;
  }
`;