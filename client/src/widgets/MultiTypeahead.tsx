import * as React from 'react';
import { Typeahead } from 'react-bootstrap-typeahead';
import { FilterOption } from './models/FilterOptionModel';
import styled from 'styled-components';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import { caret } from '../utils/StyleUtils';

/* tslint:disable:no-any*/
interface  Props {
  options: FilterOption[];
  onChange: (e: FilterOption[]) => void;
  placeholder: string;
  disabled?: boolean;
  selected?: any;
  className?: string;
}

export const MultiTypeahead =  (props: Props) => {
  return (
    <div className={props.className}>
      <Typeahead
        selected={props.selected}
        disabled={props.disabled}
        multiple={true}
        highlightOnlyResult={true}
        selectHintOnEnter={true}
        onChange={props.onChange}
        options={props.options}
        placeholder={props.placeholder}
      />
    </div>
  );
};

export const StyledMultiTypeahead = styled(MultiTypeahead)`
  .rbt {
  
    .rbt-sr-status {
      display: none;
    }
    
    .rbt-token-removeable {
      background: transparent;
      border: 1px solid ${props => props.theme.graySteel};
      color: ${props => props.theme.fontColor};
      
      .rbt-token-remove-button {
        background: transparent;
        border: 0;
        cursor: pointer;
        
        .sr-only {
          display: none;
        }
      }
        
      &.rbt-token-active {
        border-width: 2px;
      }
    }
        
    .rbt-input {
      border-bottom: 1px solid ${props => props.theme.graySteel} !important;
      padding: 0.5rem 0.5rem 0.5rem 0 !important;
      height: 1rem;
        
      input {
        font-size: 1rem;
        color: ${props => props.theme.fontColor};
      }
      
      &:after {
        content: ' ';
        background: ${caret(false)};
        right: 0;
        height: 14px;
        width: 20px;
        top: 15px;
        position: absolute;
        pointer-events: none;
      }
      
      .rbt-input-wrapper {
        overflow: initial;
      }
      
      .rbt-input-hint {
        display: none;
      }
    }
    
    ul {
      padding: 0;
      border: 1px solid ${props => props.theme.graySteel};
      border-top: none;
      margin: 0;
    }

    li {
      display: flex;
      align-items: center;
      list-style: none;
      padding: 0.5rem 1rem;

      a {
        text-decoration: none;
        display: inline-block;
        width: 100%;
      }

      span {
        color: ${props => props.theme.fontColor}
      }
    }
    
    li:nth-child(odd) {
      background-color: ${props => props.theme.lighter};
    
      &.active, &:hover {
        background-color: ${props => props.theme.light};
      }
    }
    
    li:nth-child(even) {
      background-color: ${props => props.theme.lightest};
    
      &.active, &:hover {
        background-color: ${props => props.theme.light};
      }
    }
    
    .disabled {
      display: none;
    }
    
    .dropdown-menu {
      position: absolute;
      width: 100%;
      background-color: ${props => props.theme.light};
    }
  }
`;
