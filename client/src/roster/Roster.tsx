import * as React from 'react';
import styled from 'styled-components';
import { StyledPlanner } from './Planner';
import { observer } from 'mobx-react';
import { TrackerStore } from '../tracker/stores/TrackerStore';
import { StyledPlannerHeader } from '../widgets/PlannerHeader';
import { StyledNotification } from '../widgets/Notification';
import { StyledMultiTypeahead } from '../widgets/MultiTypeahead';
import { TabType } from '../tracker/stores/SidePanelStore';
import { AirmanDatum } from '../tracker/AirmanDatum';
import { StyledTextInput } from '../widgets/TextInput';
import { StyledShiftDropdown } from '../ShiftDropdown';

interface Props {
  trackerStore: TrackerStore;
  className?: string;
}

const formatAttributes = (objArray: object[], key: string) => objArray.map((object: object) => object[key]).join(' / ');

@observer
export class Roster extends React.Component<Props> {
  render() {
    return (
      <div className={this.props.className}>
        <table>
          <caption>Roster</caption>
          <thead>
          <tr>
            <th>SHIFT</th>
            <th className="name">
              <div>NAME</div>
                <StyledTextInput
                    value={this.props.trackerStore.lastNameFilter}
                    name="last-name"
                    onChange={this.props.trackerStore.setLastNameFilter}
                    placeholder="Search by Last Name"
                    className="last-name-search"
                />
            </th>
            <th className="qualification">
              <div>QUALIFICATION</div>
              {this.renderQualificationFilter()}
            </th>
            <th className="certification">
              <div>CERTIFICATION</div>
              {this.renderCertificationFilter()}
            </th>
            <StyledPlannerHeader plannerStore={this.props.trackerStore.plannerStore}/>
          </tr>
          </thead>
          <tbody>
          {this.renderAirmen()}
          </tbody>
        </table>
        {
          this.props.trackerStore.airmen.length === 0 &&
          <StyledNotification>No members at this location match your search.</StyledNotification>
        }
      </div>
    );
  }

  private renderAirmen() {
    const {trackerStore} = this.props;
    const selectedAirmanId = trackerStore.selectedAirman.id;
    return trackerStore.airmen.map((airman, index) => {
      const className = airman.id === selectedAirmanId ? 'selected' : '';
      return (
        <tr
          key={index}
          className={className}
        >
          <StyledShiftDropdown airman={airman} trackerStore={trackerStore}/>
          <AirmanDatum
            trackerStore={trackerStore}
            airman={airman}
            text={`${airman.lastName}, ${airman.firstName}`}
            tab={TabType.AVAILABILITY}
            className="airman-name"
          />
          <AirmanDatum
            trackerStore={trackerStore}
            airman={airman}
            text={formatAttributes(airman.qualifications, 'acronym')}
            tab={TabType.CURRENCY}
            className="airman-qual"
          />
          <AirmanDatum
            trackerStore={trackerStore}
            airman={airman}
            text={formatAttributes(airman.certifications, 'title')}
            tab={TabType.CURRENCY}
            className="airman-cert"
          />
          <StyledPlanner
            week={trackerStore.plannerStore.plannerWeek}
            trackerStore={trackerStore}
            airman={airman}
          />
        </tr>
      );
    });
  }

  private renderQualificationFilter() {
    return (
      <StyledMultiTypeahead
        onChange={this.props.trackerStore.setQualificationIds}
        options={this.props.trackerStore.qualificationFilterOptions}
        placeholder="Filter Qualifications"
        className="qualifications-multiselect"
      />
    );
  }

  private renderCertificationFilter() {
    return (
      <StyledMultiTypeahead
        onChange={this.props.trackerStore.setCertificationIds}
        options={this.props.trackerStore.certificationOptions}
        placeholder="Filter Certifications"
        className="certifications-multiselect"
      />
    );
  }
}

export const StyledRoster = styled(Roster)`
  border: 1px solid ${props => props.theme.graySteel};
  
  table { 
    border-collapse: collapse;
    background-color: ${props => props.theme.dark};
    width: 100%;
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
   
  tbody tr:hover {
    background-color: ${props => props.theme.darker}
  }
  
  tbody tr {
    position: relative;
    cursor: pointer;
  }
  
  tbody tr:nth-child(even) {
    background-color: ${props => props.theme.light};
    
    &:hover {
      background-color: ${props => props.theme.darker};
    }
  }
  
  td, 
  th {
    padding: 0.75rem;
  }
  
  .selected {
    box-shadow: inset 0.5rem 0px 0px ${props => props.theme.yellow};
  }
  
  .name{
    width: 16%;
  }
  
  .qualification{
    width: 14%;
  }
  
  .qualifications-multiselect, .certifications-multiselect, .last-name-search {
    margin-top: 0.25rem;
  }
  
  input.last-name-search {
    font-size: 1rem;
    padding-top: 0.5rem;
    padding-bottom: 0.25rem;
  }
  
  .certification{
    width: 24%;
  }
  
  .planner-row {
    display: flex;
    justify-content: space-between;
  }

  .airman-cert {
    border-right: 1px solid ${props => props.theme.graySteel};
  }
`;
