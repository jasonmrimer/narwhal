import * as React from 'react';
import AirmanModel from '../../airman/models/AirmanModel';
import styled from 'styled-components';
import CloseIcon from '../../icons/CloseIcon';
import { Moment } from 'moment';
import Availability from './Availability';
import Currency from './Currency';
import Tab from './Tab';

interface Props {
  airman: AirmanModel;
  closeCallback: () => void;
  className?: string;
  week: Moment[];
}

interface State {
  selectedTab: number;
}

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
        return <Currency airman={this.props.airman}/>;
      case 1:
      default:
        return <Availability week={this.props.week}/>;
    }
  }

  render() {
    const {airman, className, closeCallback} = this.props;

    return (
      <div className={`${className} side-panel`}>
        <div className={'header'}>
          <button onClick={closeCallback}>
            <CloseIcon/>
          </button>
          <h2>
            {airman.lastName}, {airman.firstName}
          </h2>
        </div>
        <div className="tabs">
          <Tab onClick={() => this.setSelectedTab(0)} title={'CURRENCY'} isActive={this.state.selectedTab === 0} />
          <Tab onClick={() => this.setSelectedTab(1)} title={'AVAILABILITY'} isActive={this.state.selectedTab === 1} />
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
  position: absolute;
  right: 0;
  height: 100%;

  .header{
    justify-content: baseline;
  }

  button {
    background-color: ${props => props.theme.lighter};
    border: none;
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