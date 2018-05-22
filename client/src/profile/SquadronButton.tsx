import * as React from 'react';
import { SquadronModel } from '../squadron/models/SquadronModel';
import { ProfileSitePickerStore } from './stores/ProfileSitePickerStore';
import styled from 'styled-components';
import { inject } from 'mobx-react';

interface Props {
  profileStore?: ProfileSitePickerStore;
  className?: string;
  squadron: SquadronModel;
}

export class SquadronButton extends React.Component<Props> {
  handleSelect = (e: any) => {
    e.preventDefault();
    this.props.profileStore!.setPendingSquadron(this.props.squadron);
  }

  render() {
    return (
      <div className={this.props.className}>
        <button className="squadron-button" onClick={this.handleSelect}>
          {this.props.squadron.name}
        </button>
      </div>
    );
  }
}

export const StyledSquadronButton = inject('profileStore')(styled(SquadronButton)`
  .squadron-button {
    margin-left: 2rem;
    width: calc(100% - 2rem);
  }
`);