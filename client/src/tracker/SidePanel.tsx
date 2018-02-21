import * as React from 'react';
import styled from 'styled-components';
import { CloseIcon } from '../icons/CloseIcon';
import { StyledCurrency } from '../currency/Currency';
import { StyledTab } from './Tab';
import { observer } from 'mobx-react';
import { TrackerStore } from './stores/TrackerStore';
import { StyledAvailability } from '../availability/Availability';
import { TabAlert } from '../icons/TabAlert';

interface Props {
  trackerStore: TrackerStore;
  className?: string;
}

interface State {
  selectedTab: number;
}

@observer
export class SidePanel extends React.Component<Props, State> {
  state = {
    selectedTab: 1
  };

  setSelectedTab = (selectedTab: number) => {
    this.setState({selectedTab});
  }

  renderSelectedTab = () => {
    switch (this.state.selectedTab) {
      case 0:
        this.props.trackerStore.currencyStore.setShowSkillForm(false);
        return (<StyledCurrency trackerStore={this.props.trackerStore}/>);
      case 1:
      default:
        this.props.trackerStore.availabilityStore.setShowEventForm(false);
        return (<StyledAvailability trackerStore={this.props.trackerStore}/>);
    }
  }

  render() {
    const {trackerStore, className} = this.props;

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
          <StyledTab onClick={() => this.setSelectedTab(0)} title="CURRENCY" isActive={this.state.selectedTab === 0}>
            {trackerStore.selectedAirman.hasExpiredSkills && <TabAlert/>}
          </StyledTab>
          <StyledTab
            onClick={() => this.setSelectedTab(1)}
            title="AVAILABILITY"
            isActive={this.state.selectedTab === 1}
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
  height: 100%;
  overflow: auto;
  z-index: 1000;
  
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