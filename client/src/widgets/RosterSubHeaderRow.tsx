import { observer } from 'mobx-react';
import styled from 'styled-components';
import * as React from 'react';

interface Props {
  text: string;
  style: object;
  alignment?: string;
  className?: string;
}

export const RosterSubHeaderRow = observer((props: Props) => {
  return (
    <div className={props.className} style={props.style}>{props.text}</div>
  );
});

export const StyledRosterSubHeaderRow = styled(RosterSubHeaderRow)`
  display: flex;
  background: ${props => props.theme.blueSteel};
  border-right: 1px solid ${props => props.theme.graySteel};
  border-left: 1px solid ${props => props.theme.graySteel};
  font-size: 0.875rem;
  font-weight: 200;
  padding: 0.5rem 0 0.5rem ${props => props.alignment === 'left' ? '0.5rem' : '0'};
  justify-content: ${props => props.alignment === 'left' ? 'start' : 'center'};
`;