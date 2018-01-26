import * as React from 'react';
import styled from 'styled-components';
import CloseIcon from '../../icons/CloseIcon';
import Currency from './Currency';
import Tab from './Tab';
import { observer } from 'mobx-react';
import TrackerStore from '../stores/TrackerStore';
import Availability from './Availability';

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
    const airman = this.props.trackerStore.selectedAirman;
    switch (this.state.selectedTab) {
      case 0:
        return <Currency airman={airman}/>;
      case 1:
      default:
        return <Availability trackerStore={this.props.trackerStore}/>;
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
          <Tab onClick={() => this.setSelectedTab(0)} title={'CURRENCY'} isActive={this.state.selectedTab === 0}/>
          <Tab onClick={() => this.setSelectedTab(1)} title={'AVAILABILITY'} isActive={this.state.selectedTab === 1}/>
        </div>
        <div>
          {this.renderSelectedTab()}
        </div>
      </div>
    );
  }
}

export default styled(SidePanel)`
  background-color: ${props => props.theme.lighter};
  min-width: 380px;
  padding: 0 1rem;
  position: fixed;
  right: 0;
  height: 100%;
  overflow: auto;
  
  .header{
    justify-content: baseline;
  }

  button {
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
    border-bottom: 1px solid ${props => props.theme.graySteel};
  }
`;