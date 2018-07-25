import * as React from 'react';
import { inject, observer } from 'mobx-react';
import styled from 'styled-components';
import { StyledPopupModal } from '../../widgets/popups/PopupModal';
import { AdminSquadronActions } from '../actions/AdminSquadronActions';
import { StyledTextInput } from '../../widgets/inputs/TextInput';
import { StyledSingleTypeahead } from '../../widgets/inputs/SingleTypeahead';

interface Props {
  className?: string;
  adminSquadronActions?: AdminSquadronActions;
}

@observer
export class AddSquadronPopup extends React.Component<Props> {
  render() {
    const {className, adminSquadronActions} = this.props;
    return (

      <StyledPopupModal
        title="ADD SQUADRON"
        className={className}
        onCancel={adminSquadronActions!.hideAddSquadron}
        onConfirm={async () => await adminSquadronActions!.performLoading(adminSquadronActions!.confirmAddSquadron)}
      >
        <div className="message">
          <StyledSingleTypeahead
            options={adminSquadronActions!.siteOptions}
            onChange={adminSquadronActions!.onSquadronSiteChange}
            clearButton={false}
            placeholder="SELECT SITE"
            selected={adminSquadronActions!.selectedSite}
            className="site"
            filterBy={() => true}
          />
          <StyledTextInput
            value={adminSquadronActions!.pendingSquadronName}
            name="name-input"
            className="name"
            placeholder="SET SQUADRON NAME"
            onChange={e => adminSquadronActions!.onSquadronNameChange(e.target.value)}
          />
        </div>
      </StyledPopupModal>
    );
  }
}

export const StyledAddSquadronPopup = inject(
  `adminSquadronActions`
)(styled(AddSquadronPopup)`
    padding: 0.5rem 0;
    
    .message {
      margin: 0 0.5rem;
      display: flex;
      justify-content: center;
      
      .site {
        width: 10rem;
        margin-right: 4rem;
      }
      
      .name {
        width: 12rem;
      }
    }
`);