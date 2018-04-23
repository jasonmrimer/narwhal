import * as React from 'react';
import styled from 'styled-components';
import { CloseIcon } from '../icons/CloseIcon';
import { StyledCurrency } from '../currency/Currency';
import { StyledTab } from './Tab';
import { inject, observer } from 'mobx-react';
import { TrackerStore } from './stores/TrackerStore';
import { StyledAvailability } from '../availability/Availability';
import { TabAlert } from '../icons/TabAlert';
import { SidePanelStore, TabType } from './stores/SidePanelStore';
import { AvailabilityStore } from '../availability/stores/AvailabilityStore';
import { PlannerStore } from '../roster/stores/PlannerStore';
import { CurrencyStore } from '../currency/stores/CurrencyStore';

interface Props {
  trackerStore?: TrackerStore;
  sidePanelStore?: SidePanelStore;
  availabilityStore?: AvailabilityStore;
  currencyStore?: CurrencyStore;
  plannerStore?: PlannerStore;
  className?: string;
}

@observer
export class SidePanel extends React.Component<Props> {
  renderSelectedTab = () => {
    const {sidePanelStore} = this.props;
    const {selectedTab} = sidePanelStore!;

    switch (selectedTab) {
      case TabType.CURRENCY:
        return (
          <StyledCurrency/>
        );
      case TabType.AVAILABILITY:
      default:
        return (
          <StyledAvailability/>
        );
    }
  }

  render() {
    const {trackerStore, className, sidePanelStore, availabilityStore, currencyStore, plannerStore} = this.props;
    const {clearSelectedAirman, selectedAirman} = trackerStore!;
    const {closeEventForm} = availabilityStore!;
    const {closeSkillForm} = currencyStore!;
    const {setSelectedTab, selectedTab} = sidePanelStore!;
    return (
      <div className={`${className} side-panel`}>
        <div className={'header'}>
          <button
            className="close"
            onClick={() => {
              clearSelectedAirman();
              plannerStore!.setSidePanelWeek(plannerStore!.plannerWeek);
            }}
          >
            <CloseIcon/>
          </button>
          <h2>
            {selectedAirman.lastName}, {selectedAirman.firstName}
          </h2>
        </div>
        <div className="tabs">
          <StyledTab
            onClick={() => {
              closeEventForm();
              setSelectedTab(TabType.CURRENCY);
            }}
            title="CURRENCY"
            isActive={selectedTab === TabType.CURRENCY}
          >
            {selectedAirman.hasExpiredSkills && <TabAlert/>}
          </StyledTab>
          <StyledTab
            onClick={() => {
              closeSkillForm();
              setSelectedTab(TabType.AVAILABILITY);
            }}
            title="AVAILABILITY"
            isActive={selectedTab === TabType.AVAILABILITY}
          />
        </div>
        <div>
          {this.renderSelectedTab()}
        </div>
      </div>
    );
  }
}

export const StyledSidePanel = inject(
  'trackerStore',
  'sidePanelStore',
  'availabilityStore',
  'currencyStore',
  'plannerStore'
)(styled(SidePanel)`
  background-color: ${props => props.theme.lighter};
  min-width: 380px;
  max-width: 380px;
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
`);