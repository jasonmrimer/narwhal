import * as React from 'react';
import styled from 'styled-components';
import { Theme } from '../themes/default';
import { BackArrow } from '../icons/BackArrow';
import { Link } from 'react-router-dom';

interface Props {
  location: string;
  text?: string;
  className?: string;
}

export const NavigationBackButton = (props: Props) => {
  return (
    <Link to={props.location} className={props.className}>
      <BackArrow color={Theme.graySteel}/>
      <span>{props.text || 'Back'}</span>
    </Link>
  );
};

export const StyledNavigationBackButton = styled(NavigationBackButton)`
  display: flex;
  justify-content: center;
  align-items: center;
  
  cursor: pointer;
  text-decoration: none;
  
  color: ${props => props.theme.graySteel};
  font-size: 0.875rem;
  
  fill: ${props => props.theme.graySteel};
  background: none;
  
  margin: 1.5rem 0;

  span {
    margin-left: 0.5rem;
  }
`;