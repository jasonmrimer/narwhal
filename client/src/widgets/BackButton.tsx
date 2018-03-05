import * as React from 'react';
import styled from 'styled-components';
import { Theme } from '../themes/default';
import { BackArrow } from '../icons/BackArrow';

/*tslint:disable:no-any*/
interface Props {
  onClick: (e: any) => void;
  text?: string;
  className?: string;
}

export const BackButton = (props: Props) => {
  return (
    <a className={props.className} onClick={props.onClick}>
      <BackArrow color={Theme.graySteel}/>
      <span>{props.text}</span>
    </a>
  );
};

export const StyledBackButton = styled(BackButton)`
  cursor: pointer;
  fill: ${props => props.theme.graySteel};
  background: none;
  color: ${props => props.theme.graySteel};
  font-size: 0.875rem;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 1.5rem 0;

    span {
      margin-left: 0.5rem;
    }
`;