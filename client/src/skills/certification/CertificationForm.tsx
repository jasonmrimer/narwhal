import * as React from 'react';
import { CertificationFormStore } from './stores/CertificationFormStore';
import { inject, observer } from 'mobx-react';
import styled from 'styled-components';
import { StyledTextInput } from '../../widgets/inputs/TextInput';
import { StyledSubmitButton } from '../../widgets/forms/SubmitButton';
import { StyledForm } from '../../widgets/forms/Form';
import { StyledNavigationBackButton } from '../../widgets/buttons/NavigationBackButton';

interface Props {
  certificationFormStore?: CertificationFormStore;
  className?: string;
}

@observer
export class CertificationForm extends React.Component <Props> {
  render() {
    const {certificationFormStore, className} = this.props;
    if (!certificationFormStore!.certification) {
      return null;
    }

    return (
      <div className={className}>
        <StyledForm
          onSubmit={async (e) => {
            e.preventDefault();
            await certificationFormStore!.update();
          }}
          performLoading={certificationFormStore!.performLoading}
        >
          <div className="navigation-section">
            <StyledNavigationBackButton
              location="/flights"
            />

            <StyledSubmitButton
              text="save"
            />
          </div>
          <div className="form-fields">
            <h2>{certificationFormStore!.certification.title}</h2>
            <h3>Certification</h3>
            <div className="input-row">
              <label htmlFor="acronym">Acronym</label>
              <StyledTextInput
                value={certificationFormStore!.certification.title}
                onChange={(e) => {
                  certificationFormStore!.setCertificationTitle(e.target.value);
                }}
                name="acronym"
                id="acronym"
              />
            </div>
          </div>
        </StyledForm>
      </div>
    );
  }
}

export const StyledCertificationForm = inject(
  'certificationFormStore'
)(styled(CertificationForm)`
  margin: auto 0;
  
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
      
      input {
        width: 40%;
      }
    }
  }
`);
