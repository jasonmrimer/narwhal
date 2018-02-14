import * as React from 'react';
import { Typeahead } from 'react-bootstrap-typeahead';
import { FilterOption } from './models/FilterOptionModel';
import styled from 'styled-components';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import { caret } from '../utils/StyleUtils';

interface  Props {
  options: FilterOption[];
  onChange: (e: FilterOption[]) => void;
  placeholder: string;
  className?: string;
  multiple?: boolean;
}

export const MultiSelect =  (props: Props) => {
  return (
    <div className={props.className}>
      <Typeahead
        multiple={props.multiple}
        highlightOnlyResult={true}
        selectHintOnEnter={true}
        onChange={props.onChange}
        options={props.options}
        placeholder={props.placeholder}
      />
    </div>
  );
};

export const StyledMultiSelect = styled(MultiSelect)`
  .rbt {
    .rbt-sr-status {
      display: none;
    }
    
    .rbt-token-removeable {
      background: transparent;
      border: 1px solid white;
      color: ${props => props.theme.fontColor};
      
      .rbt-token-remove-button {
        background: transparent;
        border: 0;
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
      padding: 0.765rem 0.25rem !important;
      caret-color: ${props => props.theme.fontColor};
      input {
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
    }
     
    input {
      font-size: 1rem;
    }
    
    ul {
      padding: 0;
      border: 1px solid white;
      margin: 0;
    }
    
    li {
      list-style: none;
      padding: 0.5rem 0;
      a {
        text-decoration: none;
        display: inline-block;
        width: 100%;
      }
      
      span {
        color: ${props => props.theme.fontColor}
      }
    
      &.active, &:hover {
        background: ${props => props.theme.dark};
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