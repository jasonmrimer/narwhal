import * as React from 'react';
import styled from 'styled-components';

interface Props {
  name: string;
  onChange: (e: any) => void;
  checked: boolean;
  id?: string;
  className?: string;
}

export const Checkbox = (props: Props) => {
  return (
    <input
      type="checkbox"
      id={props.id}
      className={props.className}
      name={props.name}
      onChange={props.onChange}
      checked={props.checked}
    />
  )
}

export const StyledCheckbox = styled(Checkbox)`
  visibility: hidden;
  position: relative;
  left: 3px;
  
  &:before{
    content: ' ';
    visibility: visible;
    border: 1px solid #ccc;
    width: 16px;
    height: 16px;
    display: inline-block;
    position: relative;
    top: -5px;
    right: 5px;
  }

  &:after{
    opacity: 0;
    box-sizing: border-box;
    content: '\\2713 ';
    visibility: visible;
    display: inline-block;
    width: 16px;
    height: 16px;
    font-size: 18px;
    position: relative;
    left: -4px;
    top: -24px;
    color: black;
    background: white;
    text-align: center;
    line-height: 1.03;
  }

  &:checked:after{
    opacity: 1;
  }
`;