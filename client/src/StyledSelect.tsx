import styled from 'styled-components';
import Select from 'react-select';
import 'react-select/dist/react-select.css';

export default styled(Select)`
  .Select-control{
    border: none;
    border-bottom: 1px solid ${props => props.theme.blueSteel};
    border-radius: unset;
    font-size: 1rem;
    background: ${props => props.theme.lighter};
    color: ${props => props.theme.fontColor};
    width: 90%;
    margin: 1rem 1rem 0;
  }

  .Select-menu{
    border: none;    
    font-size: 1rem;
    background: ${props => props.theme.lighter};
    color: ${props => props.theme.fontColor};
  }

  .Select-option {
    border: none;
    font-size: 1rem;
    background: ${props => props.theme.lighter};
    color: ${props => props.theme.fontColor};
    font-weight: 300;
    padding: 0.25rem 0.5rem;

    &:hover{
      color: ${props => props.theme.fontColor};
      background: ${props => props.theme.light};
    }
    &.is-focused {
      color: ${props => props.theme.fontColor};
      background: ${props => props.theme.light};
    }
  }

  .Select.is-focused > .Select-control {
    border: none;
    border-bottom: 1px solid ${props => props.theme.blueSteel};
    font-size: 1rem;
    background: ${props => props.theme.lighter};
    color: ${props => props.theme.fontColor};
    box-shadow: none;
  }
  
  .Select-input > input {
    font-size: 1rem;
    border: none;
    background: ${props => props.theme.lighter};
    color: ${props => props.theme.fontColor};
  }

  .Select-menu-outer {
    background: ${props => props.theme.lighter};
    width: 90%;
    margin: 0 1rem;
  }

  .Select-value {
    background: ${props => props.theme.lighter};
    color: ${props => props.theme.fontColor};
    vertical-align: middle;

  .Select-value-icon {
      border-right: none;

    &:hover {
        color: ${props => props.theme.fontColor};
      }
    }
  }
  
  .Select-option.is-selected {
    background: ${props => props.theme.light};
    color: ${props => props.theme.fontColor};
  }
  
  .Select-placeholder {
    background: ${props => props.theme.light};
   }
  
  #react-select-4--value-item {
    color: ${props => props.theme.fontColor};
  }
`;