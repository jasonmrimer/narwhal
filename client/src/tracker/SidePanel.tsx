import * as React from 'react';
import styled from 'styled-components';
import { CloseIcon } from '../icons/CloseIcon';
import { StyledCurrency } from '../currency/Currency';
import { StyledTab } from './Tab';
import { observer } from 'mobx-react';
import { TrackerStore } from './stores/TrackerStore';
import { StyledAvailability } from '../availability/Availability';
import { TabAlert } from '../icons/TabAlert';
import { SidePanelStore, TabType } from './stores/SidePanelStore';

interface Props {
  trackerStore: TrackerStore;
  sidePanelStore: SidePanelStore;
  className?: string;
}

@observer
export class SidePanel extends React.Component<Props> {

  renderSelectedTab = () => {
    switch (this.props.sidePanelStore.selectedTab) {
      case TabType.CURRENCY:
        return (
          <StyledCurrency
            selectedAirman={this.props.trackerStore.selectedAirman}
            currencyStore={this.props.trackerStore.currencyStore}
          />
        );
      case TabType.AVAILABILITY:
      default:
        return (
          <StyledAvailability
            selectedAirman={this.props.trackerStore.selectedAirman}
            availabilityStore={this.props.trackerStore.availabilityStore}
            missionStore={this.props.trackerStore.missionStore}
            plannerStore={this.props.trackerStore.plannerStore}
          />
        );
    }
  }

  render() {
    const {trackerStore, className, sidePanelStore} = this.props;

    return (
      <div className={`${className} side-panel`}>
        <div className={'header'}>
          <button className="close" onClick={trackerStore.clearSelectedAirman}>
            <CloseIcon/>
          </button>
          <h2>
            {trackerStore.selectedAirman.lastName}, {trackerStore.selectedAirman.firstName}
          </h2>
        </div>
        <div className="tabs">
          <StyledTab
            onClick={() => {
              trackerStore.availabilityStore.closeEventForm();
              sidePanelStore.setSelectedTab(TabType.CURRENCY);
            }}
            title="CURRENCY"
            isActive={sidePanelStore.selectedTab === TabType.CURRENCY}
          >
            {trackerStore.selectedAirman.hasExpiredSkills && <TabAlert/>}
          </StyledTab>
          <StyledTab
            onClick={() => sidePanelStore.setSelectedTab(TabType.AVAILABILITY)}
            title="AVAILABILITY"
            isActive={sidePanelStore.selectedTab === TabType.AVAILABILITY}
          />
        </div>
        <div>
          {this.renderSelectedTab()}
        </div>
      </div>
    );
  }
}

export const StyledSidePanel = styled(SidePanel)`
  background-color: ${props => props.theme.lighter};
  min-width: 380px;
  padding: 0 1rem;
  position: fixed;
  right: 0;
  top: 7rem;
  height: calc(100% - 7rem);
  overflow: auto;
  z-index: 999;
  
  .header{
    justify-content: baseline;
  }

  .close {
    background-color: ${props => props.theme.lighter};
    border: none;
    cursor: pointer;
  }

  h2 {
    font-size: calc(24rem / 16);
    padding: 0 0.75rem;
    font-weight: 400;
  }

  > div {
    display:flex;
    justify-content: space-between;
  }
  
  .tabs {
    display: flex;
    justify-content: center;
  }
`;