import * as React from 'react';
import styled from 'styled-components';
import { StyledTextInput } from '../widgets/TextInput';
import { StyledDropdown } from '../widgets/Dropdown';
import { shiftOptions, unsetShiftOptions } from '../tracker/ShiftDropdown';
import { StyledSkillTile } from '../skills/SkillTile';
import { StyledRipItemsTile } from '../rip-item/RipItemsTile';
import { observer } from 'mobx-react';
import { AirmanProfileManagerStore } from './stores/AirmanProfileManagerStore';
import { StyledNavigationBackButton } from '../widgets/NavigationBackButton';
import { StyledSubmitButton } from '../widgets/SubmitButton';
import { StyledForm } from '../widgets/Form';

interface Props {
  store: AirmanProfileManagerStore;
  className?: string;
}

@observer
export class AirmanProfileManager extends React.Component<Props> {
  render() {
    const {airman, setState} = this.props.store;
    return (
      <div className={this.props.className}>
        <StyledForm onSubmit={this.onSubmit}>

          <div className="side-nav">
            <StyledNavigationBackButton
              location="/flights"
            />
            <StyledSubmitButton
              text="SAVE"
            />
          </div>

          <div className="content">

            <div className="airman-header">
              <h1>{`${airman.lastName}, ${airman.firstName}`}</h1>
              <br/>
            </div>

            <div>
              <h2>Personal Information</h2>
              <span className="airman-profile-manager-row">
                <label htmlFor="airman-last-name">LAST NAME</label>
                <StyledTextInput
                  onChange={(e) => setState(e.target.name, e.target.value)}
                  value={airman.lastName}
                  name="lastName"
                  id="airman-last-name"
                />
              </span>
              <span className="airman-profile-manager-row">
                <label htmlFor="airman-first-name">FIRST NAME</label>
                <StyledTextInput
                  onChange={(e) => setState(e.target.name, e.target.value)}
                  value={airman.firstName}
                  name="firstName"
                  id="airman-first-name"
                />
              </span>
            </div>

            <div>
              <h2>Member Organization</h2>
              <span className="airman-profile-manager-row">
                <label htmlFor="airman-site">SITE</label>
                <StyledDropdown
                  onChange={(e) => setState(e.target.name, Number(e.target.value))}
                  name="siteId"
                  value={airman.siteId}
                  options={this.props.store.siteOptions}
                  id="airman-site"
                />
              </span>
              <span className="airman-profile-manager-row">
                <label htmlFor="airman-squadron">SQUADRON</label>
                <StyledDropdown
                  onChange={(e) => setState(e.target.name, Number(e.target.value))}
                  name="squadronId"
                  value={airman.squadronId}
                  options={this.props.store.squadronOptions}
                  id="airman-squadron"
                />
              </span>
              <span className="airman-profile-manager-row">
                <label htmlFor="airman-flight">FLIGHT</label>
                <StyledDropdown
                  onChange={(e) => setState(e.target.name, Number(e.target.value))}
                  name="flightId"
                  value={airman.flightId}
                  options={this.props.store.flightOptions}
                  id="airman-flight"
                />
              </span>
              <span className="airman-profile-manager-row">
                <label htmlFor="airman-shift">SHIFT</label>
                  <StyledDropdown
                    name="shift"
                    options={airman.shift ? shiftOptions : unsetShiftOptions}
                    value={airman.shift || -1}
                    onChange={(e) => setState(e.target.name, e.target.value)}
                    id="airman-shift"
                  />
              </span>
            </div>

            <div>
              <h2>Qualifications & Certifications</h2>
              <div className="airman-skills">
                {this.renderQualifications()}
                {this.renderCertifications()}
                {this.renderRipTile()}
              </div>
            </div>

          </div>
        </StyledForm>
      </div>
    );
  }

  private onSubmit = async (e: any) => {
    e.preventDefault();
    this.props.store.save();
  }

  private nothing() {
    return;
  }

  private renderQualifications = () => {
    return this.props.store.airman.qualifications.map((qual, index) => (
      <StyledSkillTile
        key={index}
        skill={qual}
        onClick={this.nothing}
      />
    ));
  }

  private renderCertifications = () => {
    return this.props.store.airman.certifications.map((cert, index) => (
      <StyledSkillTile
        key={index}
        skill={cert}
        onClick={this.nothing}
      />
    ));
  }

  private renderRipTile = () => {
    return (
      <StyledRipItemsTile
        title="RIP TASKS"
        assignedItemCount={this.props.store.assignedItemCount}
        expiredItemCount={this.props.store.expiredItemCount}
        onClick={this.nothing}
      />
    );
  }
}

export const StyledAirmanProfileManager = styled(AirmanProfileManager)`
  .side-nav{
    position: fixed;
    left: 5rem;
    
    & > a {
      margin-top: 0;
    }
  }

  .content {
    width: 32rem;
    margin: auto;
    color: ${props => props.theme.fontColor};
        
    h1 {
      font-weight: 300;
    }
    
    h2 {
      font-weight: 300;
      font-size: 1.25rem;
      padding-top: 0.5rem;
      border-top: 1px solid ${props => props.theme.purpleSteel};
    }
    
    .airman-profile-manager-row {
      display: flex;
      justify-content: space-between;
      align-content: center;
      padding: 1.5rem 0;
      
      label {
        width: 20%;
        align-self: center;
      }
      
      input, select {
        width: 14rem;
      }
    }
    
    .airman-skills {
      margin: auto;
      width: 20rem;
      
      & > * {
        margin-bottom: 1.5rem;
      }
    }
  }
`;