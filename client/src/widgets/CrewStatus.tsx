import * as React from 'react';
import * as classNames from 'classnames';
import styled from 'styled-components';

interface Props {
  hasCrew: boolean;
  className?: string;
}

export const CrewStatus = (props: Props) => {
  const {hasCrew, className} = props;

  return (
    <div className={classNames(className, {drafting: hasCrew})}>
      {hasCrew ? 'DRAFTING' : 'NO CREW'}
    </div>
  );
};

export const StyledCrewStatus = styled(CrewStatus)`
  font-weight: 500;
  width: fit-content;
  align-self: center;
  padding: .3125rem;
  background: ${props => props.theme.fontColor};
  color: ${props => props.theme.darkest};

  &.drafting {
    background: ${props => props.theme.copper};
    color: ${props => props.theme.fontColor};
  }
`;