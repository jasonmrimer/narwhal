import * as React from 'react';
import { CrewStore } from './stores/CrewStore';
import { CrewPositionModel } from './models/CrewPositionModel';
import { FilterOption } from '../widgets/models/FilterOptionModel';
import styled from 'styled-components';
import { observer } from 'mobx-react';
import { StyledCrewPositionRow } from './CrewPositionRow';
import { StyledCrewPositionInputRow } from '../CrewPositionInputRow';

interface Props {
  crewStore: CrewStore;
  className?: string;
}

@observer
export class Crew extends React.Component<Props> {
  onCheck = (e: any, id: number) => {
    this.props.crewStore.setCrewEntry(id, {[e.target.name]: e.target.checked});
  }

  onChange = (e: any, id: number) => {
    this.props.crewStore.setCrewEntry(id, {[e.target.name]: e.target.value});
  }

  handleDeleteChange = (e: any, id: number) => {
    this.props.crewStore.clearPosition(id);
  }

  handleNewEntryCheck = (e: any) => {
    this.props.crewStore.setNewEntry({[e.target.name]: e.target.checked});
  }

  handleNewEntryChange = (e: any) => {
    this.props.crewStore.setNewEntry({[e.target.name]: e.target.value});
  }

  handleTypeahead = (opt: FilterOption) => {
    if (opt) {
      this.props.crewStore.setNewEntry({airmanName: opt.label});
    } else {
      this.props.crewStore.setNewEntry({airmanName: ''});
    }
  }

  render() {
    return (
      <div className={this.props.className}>
        <div className="crew">
          <div className="header-top">PERSONNEL ASSIGNED TO MISSION</div>
          <div className="header">
            <span className="critical">CRITICAL</span>
            <span className="position">POSITION</span>
            <span className="member">ASSIGNED CREW MEMBER</span>
          </div>
          {this.renderCrew()}
          <StyledCrewPositionInputRow
            crewStore={this.props.crewStore}
            handleNewEntryCheck={this.handleNewEntryCheck}
            handleNewEntryChange={this.handleNewEntryChange}
            handleTypeahead={this.handleTypeahead}
          />
        </div>
      </div>
    );
  }

  private renderCrew = () => {
    const {crew} = this.props.crewStore;
    if (crew == null) {
      return [];
    }

    return crew.crewPositions.map((crewPosition: CrewPositionModel, index: number) => {
      return (
        <StyledCrewPositionRow
          key={index}
          crewPosition={crewPosition}
          index={index}
          onCheck={(e) => this.onCheck(e, crewPosition.id!)}
          onChange={(e) => this.onChange(e, crewPosition.id!)}
          handleDelete={(e) => this.handleDeleteChange(e, crewPosition.id!)}
        />
      );
    });
  }

}

export const StyledCrew = styled(Crew)`
  .crew {
    min-width: 800px;
    width: 80%;
    border: 1px solid ${props => props.theme.graySteel};
  }
  
  .header-top {
    height: 2rem;
    width: 100%;
    background: ${props => props.theme.blueSteel};
    border-bottom: 1px solid ${props => props.theme.graySteel};
    display: flex;
    align-items: center;
    justify-content: center;
  }
 
  .header {
    display: flex;
    width: 100%;
    background: ${props => props.theme.lighter};
    padding: 0.75rem;
    height: 5rem;
    align-items: flex-end;
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
    padding: 0 1rem 0 0;
  }
`;