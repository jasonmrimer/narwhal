import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { StyledSquadronList } from './SquadronList';
import styled from 'styled-components';
import { StyledProfileList } from './ProfileList';

interface Props {
  className?: string;
}

@observer
export class AdminManager extends React.Component<Props> {
  render() {
    return (
      <React.Fragment>
        <div className={this.props.className}>
          <StyledProfileList/>
          <StyledSquadronList/>
        </div>
      </React.Fragment>
    );
  }
}

export const StyledAdminManager = inject()(styled(AdminManager)`
  display: flex; 
  flex-wrap: nowrap;
  width: 100%;
  min-width: 1000px;
  margin-top: 10rem;
`);
