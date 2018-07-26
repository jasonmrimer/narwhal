import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { StyledSquadronList } from './SquadronList';
import styled from 'styled-components';
import { StyledProfileList } from './ProfileList';
import { AdminSquadronStore } from './stores/AdminSquadronStore';
import { StyledAddSquadronPopup } from './popups/AddSquadronPopup';

interface Props {
  className?: string;
  adminSquadronStore?: AdminSquadronStore;
}

@observer
export class AdminManager extends React.Component<Props> {
  render() {
    return (
      <React.Fragment>
        <div className={this.props.className}>
          <StyledProfileList/>
          {
            this.props.adminSquadronStore!.hasPendingSquadron &&
              <StyledAddSquadronPopup/>
          }
          <StyledSquadronList/>
        </div>
      </React.Fragment>
    );
  }
}

export const StyledAdminManager = inject(
  `adminSquadronStore`
)(styled(AdminManager)`
  display: flex; 
  flex-wrap: nowrap;
  width: 100%;
  min-width: 1000px;
  margin-top: 10rem;
`);
