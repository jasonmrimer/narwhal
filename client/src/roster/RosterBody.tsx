import * as React from 'react';
import styled from 'styled-components';
import { TrackerStore } from '../tracker/stores/TrackerStore';
import { StyledShiftDropdown } from '../ShiftDropdown';
import { AirmanModel } from '../airman/models/AirmanModel';
import { TabType } from '../tracker/stores/SidePanelStore';
import { AirmanDatum } from '../tracker/AirmanDatum';
import { formatAttributes } from '../utils/StyleUtils';
import { observer } from 'mobx-react';
import * as classNames from 'classnames';
import { StyledPlanner } from './Planner';
import { StyledNotification } from '../widgets/Notification';

interface Props {
  trackerStore: TrackerStore;
  className?: string;
}

@observer
export class RosterBody extends React.Component<Props> {
  render() {
    const {trackerStore} = this.props;
    const selectedAirmanId = trackerStore.selectedAirman.id;

    return (
      <div className={this.props.className}>
        {
          trackerStore.airmen.map((airman: AirmanModel, index: number) => {
            const className = airman.id === selectedAirmanId ? 'selected' : '';
            return (
              <div
                key={index}
                className={classNames('tr', className)}
              >
                <div className="left">
                  <StyledShiftDropdown
                    airman={airman}
                    trackerStore={trackerStore}
                    className="shift"
                  />
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
                </div>
                <div className="right">
                  <StyledPlanner
                    key={index}
                    week={this.props.trackerStore.plannerStore.plannerWeek}
                    trackerStore={this.props.trackerStore}
                    airman={airman}
                  />
                </div>
              </div>
            );
          })
        }
        {
          this.props.trackerStore.airmen.length === 0 &&
          <StyledNotification>No members at this location match your search.</StyledNotification>
        }

      </div>
    );
  }
}

export const StyledRosterBody = styled(RosterBody)`
  width: 100%;
  border-top: 0;
  
  & > div { 
    display: flex;
    
    &:nth-child(even) {
      background-color: ${props => props.theme.lighter};
    }
    
    &:hover {
      background: ${props => props.theme.darkest};
    }
    
    & > div {
      & > span {
        width: 23%;
      }
      
      &.left {
        width: 868px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.75rem;
        border-right: 1px solid ${props => props.theme.graySteel};
      }
    }
   
    .right { 
      display: flex;
      flex-grow: 2;
      align-items: center;
      padding: 0.75rem;
    }
  }
  
  .shift {
    width: 2rem;
  }
`;