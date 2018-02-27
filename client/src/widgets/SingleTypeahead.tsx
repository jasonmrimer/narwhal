import * as React from 'react';
import { Typeahead } from 'react-bootstrap-typeahead';
import { FilterOption } from './models/FilterOptionModel';
import styled from 'styled-components';
import 'react-bootstrap-typeahead/css/Typeahead.css';

/* tslint:disable:no-any*/
interface  Props {
  options: FilterOption[];
  onChange: (opt: FilterOption | null) => void;
  placeholder: string;
  disabled?: boolean;
  selected?: FilterOption | null;
  className?: string;
}

export const SingleTypeahead =  (props: Props) => {
  return (
    <div className={props.className}>
      <Typeahead
        selected={props.selected != null ? [props.selected] : undefined}
        disabled={props.disabled}
        highlightOnlyResult={true}
        selectHintOnEnter={true}
        onChange={(opt: FilterOption[]) => props.onChange(opt.length === 1 ? opt[0] : null)}
        options={props.options}
        placeholder={props.placeholder}
        clearButton={true}
      />
    </div>
  );
};

export const StyledSingleTypeahead = styled(SingleTypeahead)`
  width: 100%;
  
  .rbt {
    .rbt-sr-status {
      display: none;
    }
        
    .rbt-input {
      border-bottom: 1px solid ${props => props.theme.graySteel} !important;
      padding: 0.5rem 0.5rem 0.5rem 0 !important;
      height: 1rem;
        
      input {
        font-size: 1rem;
        color: ${props => props.theme.fontColor};
      }
      
      .rbt-input-wrapper {
        overflow: initial;
      }
      
      .rbt-input-hint {
        display: none;
      }
    }
    
    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0,0,0,0);
      border: 0;
    }
    
    button.close {
        padding: 0;
        cursor: pointer;
        background: 0 0;
        border: 0;
    }
    
    .rbt-close {
        z-index: 1;
    }
    
    .close {
        float: right;
        font-size: 1.25rem;
        font-weight: 300;
        line-height: 1;
        color: ${props => props.theme.fontColor};
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