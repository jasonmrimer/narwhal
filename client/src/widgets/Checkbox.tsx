import * as React from 'react';
import styled from 'styled-components';
import * as classNames from 'classnames';

interface Props {
  name: string;
  onChange: (e: any) => void;
  checked: boolean;
  id?: string;
  className?: string;
}

export const Checkbox = (props: Props) => {
  return (
    <label
      className={classNames('container', props.className)}
    >
      <input
        type="checkbox"
        id={props.id}
        name={props.name}
        onChange={props.onChange}
        checked={props.checked}
      />
      <span className="checkmark"/>
    </label>
  );
};

export const StyledCheckbox = styled(Checkbox)`
  display: block;
  position: relative;
  padding-left: 16px;
  cursor: pointer;
  user-select: none;


  input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
  }

  .checkmark {
    position: absolute;
    top: 0;
    left: 0;
    height: 15px;
    width: 15px;
    background-color: transparent;
    border: 1px solid white;
  }

  &:hover input ~ .checkmark {
    background-color: ${props => props.theme.graySteel};
  }

  input:checked ~ .checkmark {
    background-color: ${props => props.theme.fontColor};
  }

  .checkmark:after {
    content: "";
    position: absolute;
    display: none;
  }

  input:checked ~ .checkmark:after {
    display: block;
  }

  .checkmark:after {
    left: 3px;
    top: -1px;
    width: 5px;
    height: 10px;
    border: solid black;
    border-width: 0 3px 3px 0;
    -webkit-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    transform: rotate(45deg);
  }
`;