import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { AdminSquadronStore } from './admin/stores/AdminSquadronStore';
import { AdminSquadronActions } from './admin/actions/AdminSquadronActions';
import { StyledAddSquadronPopup } from './admin/popups/AddSquadronPopup';
import { StyledDeletePopup } from './widgets/popups/DeletePopup';
import { StyledSquadronList } from './admin/SquadronList';
import styled from 'styled-components';

interface Props {
  className?: string;
  adminSquadronStore?: AdminSquadronStore;
  adminSquadronActions?: AdminSquadronActions;
}

@observer
export class AdminSquadronManager extends React.Component<Props> {
  render() {
    return (
      <React.Fragment>
          {
            this.props.adminSquadronStore!.hasPendingSquadron &&
            <StyledAddSquadronPopup/>
          }
          {
            this.props.adminSquadronStore!.hasPendingDeleteSquadron &&
            <StyledDeletePopup
              item={this.props.adminSquadronStore!.pendingDeleteSquadron!}
              onConfirm={async () => {
                await this.props.adminSquadronStore!.performLoading(async () =>
                  await this.props.adminSquadronActions!.deleteSquadron(
                    this.props.adminSquadronStore!.pendingDeleteSquadron!.squadronId!
                  ));
              }}
              onCancel={() => this.props.adminSquadronStore!.setPendingDeleteSquadron(null)}
            />
          }
          <StyledSquadronList/>
      </React.Fragment>
    );
  }
}

export const StyledAdminSquadronManager = inject(
  `adminSquadronStore`,
  `adminSquadronActions`
)(styled(AdminSquadronManager)`
`);
