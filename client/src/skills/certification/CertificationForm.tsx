import * as React from 'react';
import { CertificationFormStore } from './stores/CertificationFormStore';
import { inject, observer } from 'mobx-react';
import styled from 'styled-components';
import { StyledTextInput } from '../../widgets/inputs/TextInput';
import { StyledSubmitButton } from '../../widgets/forms/SubmitButton';
import { StyledForm } from '../../widgets/forms/Form';
import { StyledNavigationBackButton } from '../../widgets/buttons/NavigationBackButton';
import { StyledFieldValidation } from '../../widgets/inputs/FieldValidation';
import { CertificationActions } from './CertificationActions';
import { StyledAlert } from '../../widgets/Alert';
import { StyledConfirmationPopup } from '../../widgets/ConfirmationPopup';
import { ProfileSitePickerStore } from '../../profile/stores/ProfileSitePickerStore';
import { DeleteIcon } from '../../icons/DeleteIcon';

interface Props {
  certificationFormStore?: CertificationFormStore;
  certificationActions?: CertificationActions;
  profileStore?: ProfileSitePickerStore;
  history?: History;
  className?: string;
}

@observer
export class CertificationForm extends React.Component <Props> {
  render() {
    const {certificationFormStore, certificationActions, className} = this.props;
    const {certification} = certificationFormStore!;

    if (!certification) {
      return null;
    }

    return (
      <div className={className}>
        <StyledForm
          className="certification-form"
          onSubmit={async (e: any) => {
            e.preventDefault();
            await certificationActions!.submit(this.props.history);
          }}
          performLoading={certificationFormStore!.performLoading}
        >
          <div className="navigation-section">
            <StyledNavigationBackButton
              location="/flights"
            />
            <StyledSubmitButton
              text="SAVE"
            />
          </div>
          <div className="form-fields">
            {
              certificationFormStore!.didSave &&
              <StyledAlert>Your changes have been saved.</StyledAlert>
            }
            <h2>{certificationFormStore!.certification.title}</h2>
            <h3>Certification</h3>

            <div className="input-row">
              <label htmlFor="title">Acronym</label>
              <StyledFieldValidation
                fieldName="title"
                errors={certificationFormStore!.errors}
              >
                <StyledTextInput
                  value={certificationFormStore!.certification.title}
                  onChange={(e) => {
                    certificationFormStore!.setCertificationTitle(e.target.value);
                  }}
                  name="title"
                  id="title"
                />
              </StyledFieldValidation>
            </div>
            <span
              className="delete"
              onClick={this.props.certificationActions!.setPendingDelete}
            >
              <DeleteIcon />
              DELETE
            </span>
          </div>
        </StyledForm>
        {
          certificationFormStore!.pendingDelete &&
          <StyledConfirmationPopup
            title={certification.title}
            siteName={this.props.profileStore!.profile!.siteName}
            onCancel={this.props.certificationActions!.dismissPendingDelete}
            onConfirm={() => this.props.certificationActions!.deleteCertification(this.props.history)}
          />
        }
      </div>
    );
  }
}

export const StyledCertificationForm = inject(
  'certificationFormStore',
  'certificationActions',
  'profileStore'
)(styled(CertificationForm)`
  margin: auto 0;
  
  .certification-form {
    color: ${props => props.theme.fontColor};
  }
  
  .navigation-section {
    position: fixed;
    left: 5rem;
    
    & > a {
      margin-top: 0;
    }
  }
  
  .form-fields {
    width: 32rem;
    margin: auto;
    
    h2 {
      padding-bottom: 2rem;
      margin-bottom: 0;
      border-bottom: 1px solid ${props => props.theme.graySteel};
    }
    
    h3 {
      margin-top: 0.5rem;
    }
      
    .input-row {
      display: flex;
      justify-content: space-between;
      
      #title {
        width: 13.125rem;
      }
      
      input {
        width: 100%;
        margin-bottom: 0.5rem;
      }
    }
  }
  
  .delete {
    color: ${props => props.theme.fontColor};
    border: none;
    padding: 0.5rem;
    padding-left: 0;
    cursor: pointer;
    width: 17%;
    display: flex;
    align-items: baseline;
    justify-content: space-between;
  }
`);
