import * as React from 'react';
import { RipItemModel } from './models/RipItemModel';
import styled from 'styled-components';

interface Props {
  items: RipItemModel[];
  className?: string;
}

export const RipItems = (props: Props) => {
  return (
    <div className={props.className}>
      <h3>RIP TASKS</h3>
      {props.items.map((item: RipItemModel, index: number) => <div key={index} className="item  ">{item.title}</div>)}
    </div>
  );
};

export const StyledRipItems = styled(RipItems)`
  h3 {
    font-weight: 300;
    font-size: 1rem;
  }

  div {
    margin: 1rem;
    color: ${props => props.theme.grayishBlueSteel};
  }
`;