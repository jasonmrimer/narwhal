import * as React from 'react';
import styled from 'styled-components';
import { StyledTextInput } from '../widgets/inputs/TextInput';
import { StyledDropdown } from '../widgets/inputs/Dropdown';
import { shiftOptions, unsetShiftOptions } from '../tracker/ShiftDropdown';
import { StyledSkillTile } from '../skills/SkillTile';
import { StyledRipItemsTile } from '../rip-item/RipItemsTile';
import { observer } from 'mobx-react';
import { AirmanProfileManagerStore } from './stores/AirmanProfileManagerStore';
import { StyledNavigationBackButton } from '../widgets/buttons/NavigationBackButton';
import { StyledSubmitButton } from '../widgets/forms/SubmitButton';
import { StyledForm } from '../widgets/forms/Form';
import { inject } from 'mobx-react/custom';
import { History } from 'history';
import { StyledFieldValidation } from '../widgets/inputs/FieldValidation';
import { ProfileActions } from './actions/ProfileActions';
import { StyledAlert } from '../widgets/Alert';
import { StyledButton } from '../widgets/buttons/Button';
import { DeleteIcon } from '../icons/DeleteIcon';
import { StyledDeletePopup } from '../widgets/popups/DeletePopup';
import { StyledTextAreaInput } from '../widgets/inputs/TextAreaInput';

interface Props {
  airmanProfileManagerStore?: AirmanProfileManagerStore;
  profileActions?: ProfileActions;
  className?: string;
  history: History;
}

@observer
export class AirmanProfileManager extends React.Component<Props> {
  render() {
    const {history, className, airmanProfileManagerStore} = this.props;
    const {airman, setState, didSaveAirman} = airmanProfileManagerStore!;
    const {firstName, lastName, remarks} = airman;
    return (
      <div className={className}>

        {
          airmanProfileManagerStore!.pendingDeleteAirman &&
          <StyledDeletePopup
            item={airman}
            onConfirm={async () => await this.props.profileActions!.deleteAirman(history)}
            onCancel={() => airmanProfileManagerStore!.setPendingDeleteAirman(false)}
          />
        }

        <StyledForm
          onSubmit={this.onSubmit}
          performLoading={airmanProfileManagerStore!.performLoading}
        >
          <div className="side-nav">
            <StyledNavigationBackButton location="/flights"/>
            <StyledSubmitButton text="SAVE"/>
          </div>

          <div className="content">
            {
              didSaveAirman &&
              <StyledAlert>Your changes have been saved.</StyledAlert>
            }

            <div className="airman-header">
              <h1>
                {airman.fullName}
              </h1>
              {
                airman.isEmpty ?
                  <br/> :
                  <StyledButton
                    className="delete-member-btn"
                    text="DELETE MEMBER"
                    renderIcon={DeleteIcon}
                    onClick={async (e: any) => {
                      e.preventDefault();
                      airmanProfileManagerStore!.setPendingDeleteAirman(true);
                    }}
                  />
              }
            </div>

            <div>
              <h2>Personal Information</h2>

              <span className="airman-profile-manager-row">
                  <label htmlFor="airman-rank">RANK</label>
                  <StyledDropdown
                    onChange={(e) => setState(e.target.name, Number(e.target.value))}
                    name="rankId"
                    value={airmanProfileManagerStore!.rankId}
                    options={airmanProfileManagerStore!.rankOptions}
                    id="airman-rank"
                  />
                </span>

              <StyledFieldValidation
                fieldName="firstName"
                errors={airmanProfileManagerStore!.errors}
                rightAlign={true}
              >
                <span className="airman-profile-manager-row">
                  <label htmlFor="airman-first-name">FIRST NAME</label>
                  <StyledTextInput
                    onChange={(e) => setState(e.target.name, e.target.value)}
                    value={firstName}
                    name="firstName"
                    id="airman-first-name"
                    maxLength={35}
                  />
                </span>
              </StyledFieldValidation>

              <StyledFieldValidation
                fieldName="lastName"
                errors={airmanProfileManagerStore!.errors}
                rightAlign={true}
              >
                <span className="airman-profile-manager-row">
                  <label htmlFor="airman-last-name">LAST NAME</label>
                  <StyledTextInput
                    onChange={(e) => setState(e.target.name, e.target.value)}
                    value={lastName}
                    name="lastName"
                    id="airman-last-name"
                    maxLength={35}
                  />
                </span>
              </StyledFieldValidation>

              <span className="multiple-lines">
                <label htmlFor="airman-remarks">REMARKS</label>
                <StyledTextAreaInput
                  onChange={(e) => setState(e.target.name, e.target.value)}
                  value={remarks}
                  name="remarks"
                  id="airman-remarks"
                  maxLength={512}
                />
              </span>
            </div>
            <div>
              <h2>Member Organization</h2>
              <StyledFieldValidation
                fieldName="siteId"
                errors={airmanProfileManagerStore!.errors}
                rightAlign={true}
              >
                <span className="airman-profile-manager-row">
                  <label htmlFor="airman-site">SITE</label>
                  <StyledDropdown
                    onChange={(e) => setState(e.target.name, Number(e.target.value))}
                    name="siteId"
                    value={airman.siteId}
                    options={airmanProfileManagerStore!.siteOptions}
                    id="airman-site"
                  />
                </span>
              </StyledFieldValidation>

              <StyledFieldValidation
                fieldName="squadronId"
                errors={airmanProfileManagerStore!.errors}
                rightAlign={true}
              >
                <span className="airman-profile-manager-row">
                  <label htmlFor="airman-squadron">SQUADRON</label>
                  <StyledDropdown
                    onChange={(e) => setState(e.target.name, Number(e.target.value))}
                    name="squadronId"
                    value={airman.squadronId}
                    disabled={airmanProfileManagerStore!.squadronOptions.length === 0}
                    options={airmanProfileManagerStore!.squadronOptions}
                    id="airman-squadron"
                  />
                </span>
              </StyledFieldValidation>

              <StyledFieldValidation
                fieldName="flightId"
                errors={airmanProfileManagerStore!.errors}
                rightAlign={true}
              >
                <span className="airman-profile-manager-row">
                  <label htmlFor="airman-flight">FLIGHT</label>
                  <StyledDropdown
                    onChange={(e) => setState(e.target.name, Number(e.target.value))}
                    name="flightId"
                    value={airman.flightId}
                    disabled={airmanProfileManagerStore!.flightOptions.length === 0}
                    options={airmanProfileManagerStore!.flightOptions}
                    id="airman-flight"
                  />
                </span>
              </StyledFieldValidation>

              <span className="airman-profile-manager-row">
                <label htmlFor="airman-schedule">SCHEDULE</label>
                <StyledDropdown
                  onChange={(e) => setState(e.target.name, Number(e.target.value))}
                  name="scheduleId"
                  value={airmanProfileManagerStore!.scheduleId}
                  options={airmanProfileManagerStore!.scheduleOptions}
                  id="airman-schedule"
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
    await this.props.profileActions!.handleFormSubmit(this.props.history);
  };

  private renderQualifications = () => {
    return this.props.airmanProfileManagerStore!.airman.qualifications.map((qual, index) => (
      <StyledSkillTile
        key={index}
        skill={qual}
      />
    ));
  };

  private renderCertifications = () => {
    return this.props.airmanProfileManagerStore!.airman.certifications.map((cert, index) => (
      <StyledSkillTile
        key={index}
        skill={cert}
      />
    ));
  };

  private renderRipTile = () => {
    return (
      <StyledRipItemsTile
        title="RIP TASKS"
        assignedItemCount={this.props.airmanProfileManagerStore!.assignedItemCount}
        expiredItemCount={this.props.airmanProfileManagerStore!.expiredItemCount}
      />
    );
  };
}

export const StyledAirmanProfileManager = inject(
  'airmanProfileManagerStore',
  'profileActions',
)(styled(AirmanProfileManager)`
  .side-nav{
    position: fixed;
    left: 5rem;
    
    & > a {
      margin-top: 0;
    }
  }
  
  .delete-member-btn {
    margin: 0 0 0 auto;
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
    
    .multiple-lines {
     textarea{
      margin-top: 0.5rem;
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
`);