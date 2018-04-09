import * as React from 'react';
import { ChangeEvent } from 'react';
import styled from 'styled-components';
import { caret } from '../utils/StyleUtils';
import { FilterOption, UnfilteredValue } from './models/FilterOptionModel';
import { StyledFilterNotification } from './FilterNotification';

interface Props {
  id: string;
  unfilteredOptionLabel: string;
  value: number;
  options: FilterOption[];
  callback: (id: number) => void;
  label?: string;
  notification?: string;
  className?: string;
}

interface State {
  showNotification: boolean;
}

const handleChange = (event: ChangeEvent<HTMLSelectElement>, {callback}: Props) => {
  callback(Number(event.target.value));
};

const renderOptions = (unfilteredOptionLabel: string, options: FilterOption[]) => {
  return [{value: UnfilteredValue, label: unfilteredOptionLabel}, ...options].map((opt, i) => {
    return <option key={i} value={opt.value}>{opt.label}</option>;
  });
};

export class Filter extends React.Component<Props, State> {
  state = {showNotification: false};

  setNotification = () => {
    if (this.disabled()) {
      this.setState({showNotification: true});
      this.hideNotification();
    }
  }

  hideNotification = () => {
    setTimeout(() => {
      this.setState({showNotification: false});
    },         5000);
  }

  renderLabel = () => {
    return this.props.label ?
      [<label key="0" htmlFor={this.props.id}>{this.props.label}</label>, <br key="1"/>] :
      null;
  }

  render() {
    return (
      <div className={this.props.className} onClick={this.setNotification}>
        {this.renderLabel()}
        <select
          id={this.props.id}
          disabled={this.disabled()}
          value={this.props.value}
          onChange={(event) => handleChange(event, this.props)}
        >
          {renderOptions(this.props.unfilteredOptionLabel, this.props.options)}
        </select>
        {
          this.state.showNotification &&
          <StyledFilterNotification>{this.props.notification}</StyledFilterNotification>
        }

      </div>
    );
  }

  private disabled() {
    return this.props.options.length === 0;
  }
}

export const TopLevelFilter = styled(Filter)`
  min-width: 20%;
  display: inline-block;
  position: relative;
  float: left;
  z-index: 9;

  label {
    font-size: 0.875rem;
    font-weight: 300; 
    color: ${props => props.theme.purpleSteel}; 
  }

  &:after {
    content: ' ';
    background: ${props => caret(props.options.length === 0)};
    right: 0;
    height: 14px;
    width: 20px;
    top: 43px;
    position: absolute;
    pointer-events: none;
  }
  
  select::-ms-expand {
    display: none;
  }
  
  select {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    background: transparent;
    
    display: block;
    width: 100%;
    height: 48px;
    float: right;
    margin: 0 0 5px 0;
    font-size: 1rem;
    font-weight: 300;
    border: none;
    border-bottom: 1px solid ${props => props.theme.purpleSteel};
    color: ${props => props.theme.fontColor};
    border-radius: 0;
    cursor: pointer;
    
    &:disabled {
      color: ${props => props.theme.graySteel};
      border-bottom: 1px solid ${props => props.theme.graySteel};
      pointer-events: none;
    }
  }
  
  option {
    color: black;
  }
   
`;

export const RosterLevelFilter = styled(Filter)`
  position: relative;

  &:after {
    content: ' ';
    background: ${props => caret(props.options.length === 0)};
    right: -8px;
    height: 14px;
    width: 20px;
    top: 14px;
    position: absolute;
    pointer-events: none;
  }
  
  select::-ms-expand {
    display: none;
  }
  
  select {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    background: transparent;
    
    font-size: 1rem;
    font-weight: 300;
    
    width: 100%;
    
    border: none;
    border-bottom: 1px solid ${props => props.theme.purpleSteel};
    color: ${props => props.theme.fontColor};
    border-radius: 0;
    cursor: pointer;
    
    &:disabled {
      color: ${props => props.theme.graySteel};
      border-bottom: 1px solid ${props => props.theme.graySteel};
      pointer-events: none;
    }
  }
  
  option {
    color: black;
  } 
`;
