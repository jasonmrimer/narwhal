import * as React from 'react';
import { DayShiftIcon } from './icons/DayShiftIcon';
import { NightShiftIcon } from './icons/NightShiftIcon';
import { SwingShiftIcon } from './icons/SwingShiftIcon';
import styled from 'styled-components';
import { AirmanModel, ShiftType } from './airman/models/AirmanModel';
import { TrackerStore } from './tracker/stores/TrackerStore';
import { ShiftDisplay } from './roster/ShiftDisplay';

interface Props {
  airman: AirmanModel;
  trackerStore: TrackerStore;
  className?: string;
}

interface State {
  showDropdown: boolean;
}

/*tslint:disable:no-any*/
export class ShiftDropdown extends React.Component<Props, State> {
  node: HTMLTableDataCellElement | null = null;
  state = {showDropdown: false};

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  handleClickOutside = (event: any) => {
    if (this.node && !this.node.contains(event.target)) {
      this.setState({showDropdown: false});
    }
  }

  handleShiftIconClick(e: any, shiftType: ShiftType) {
    if (this.props.airman.shift !== shiftType) {
      this.props.trackerStore.updateAirmanShift(this.props.airman, shiftType);
    }
    this.setState({showDropdown: false});
  }

  setNode = (node: HTMLTableDataCellElement) => {
    this.node = node;
  }
  
  render() {
    return (
      <td className={this.props.className} ref={this.setNode}>
        <div onClick={() => this.setState({showDropdown: !this.state.showDropdown})}>
          <ShiftDisplay shift={this.props.airman.shift}/>
        </div>
        {this.state.showDropdown &&
          <ul>
            <li onClick={(e) => this.handleShiftIconClick(e, ShiftType.Day)}><DayShiftIcon/>Day Shift</li>
            <li onClick={(e) => this.handleShiftIconClick(e, ShiftType.Swing)}><SwingShiftIcon/>Swing Shift</li>
            <li onClick={(e) => this.handleShiftIconClick(e, ShiftType.Night)}><NightShiftIcon/>Night Shift</li>
          </ul>
        }
      </td>
    );
  }
}

export const StyledShiftDropdown = styled(ShiftDropdown)`
  position: absolute;
  
  div {
    height: 1rem;
    width: 1rem;
  }
  
  ul {
    position: absolute;
    padding: 0;
    z-index: 99999;
    border: 1px solid white;
    list-style: none;
    width: max-content;
    
    li {
      display: flex;
      align-items: center;
      padding: 1rem;
      
      :nth-child(odd) {
        background-color: ${props => props.theme.lighter};
      }
    
      :nth-child(even) {
        background-color: ${props => props.theme.lightest};
      }  
       
      &:hover {
        background-color: ${props => props.theme.darker};
      }
      
      svg {
        padding-right: 1rem;
      }
    }
  }
 `;