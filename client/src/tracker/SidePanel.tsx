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
import { SidePanelActions } from './SidePanelActions';

interface Props {
  trackerStore?: TrackerStore;
  sidePanelStore?: SidePanelStore;
  sidePanelActions?: SidePanelActions;
  className?: string;
}

@observer
export class SidePanel extends React.Component<Props> {
  renderSelectedTab = () => {
    const {sidePanelStore} = this.props;
    switch (sidePanelStore!.selectedTab) {
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
    const {trackerStore, className, sidePanelStore, sidePanelActions} = this.props;
    return (
      <div className={`${className} side-panel`}>
        <div className={'header'}>
          <button
            className="close"
            onClick={sidePanelActions!.closeSidePanel}
          >
            <CloseIcon/>
          </button>
          <h2>
            {trackerStore!.selectedAirman.fullName}
          </h2>
        </div>
        <div className="tabs">
          <StyledTab
            onClick={() => sidePanelActions!.selectTab(TabType.CURRENCY)}
            title="CURRENCY"
            isActive={sidePanelStore!.selectedTab === TabType.CURRENCY}
          >
            {trackerStore!.selectedAirman.hasExpiredSkills && <TabAlert/>}
          </StyledTab>
          <StyledTab
            onClick={() => sidePanelActions!.selectTab(TabType.AVAILABILITY)}
            title="AVAILABILITY"
            isActive={sidePanelStore!.selectedTab === TabType.AVAILABILITY}
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
  'sidePanelActions'
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