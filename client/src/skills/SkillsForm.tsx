import * as React from 'react';
import styled from 'styled-components';
import { StyledDatePicker } from '../widgets/inputs/DatePicker';
import { allSkills, SkillType } from './models/SkillType';
import { StyledButton } from '../widgets/buttons/Button';
import { StyledFieldValidation } from '../widgets/inputs/FieldValidation';
import { inject, observer } from 'mobx-react';
import { StyledSubmitButton } from '../widgets/forms/SubmitButton';
import { StyledForm, StyledFormRow } from '../widgets/forms/Form';
import { StyledDropdown } from '../widgets/inputs/Dropdown';
import { DeleteIcon } from '../icons/DeleteIcon';
import { SkillFormStore } from './stores/SkillFormStore';
import { CurrencyStore } from '../currency/stores/CurrencyStore';
import { TrackerStore } from '../tracker/stores/TrackerStore';
import { LocationFilterStore } from '../widgets/stores/LocationFilterStore';
import { SkillActions } from './SkillActions';

interface Props {
  skillFormStore?: SkillFormStore;
  currencyStore?: CurrencyStore;
  trackerStore?: TrackerStore;
  locationFilterStore?: LocationFilterStore;
  skillActions?: SkillActions;
  airmanId: number;
  className?: string;
}

@observer
export class SkillsForm extends React.Component<Props> {
  handleChange = ({target}: any) => {
    this.props.skillFormStore!.setState(target.name, target.value);
  }

  handleDelete = async () => {
    await this.props.skillActions!.deleteSkill();
  }

  handleSubmit = async (e: any) => {
    e.preventDefault();
    await this.props.skillActions!.submitSkill(this.props.airmanId);
  }

  render() {
    const {skillFormStore, trackerStore} = this.props;
    const disabled = skillFormStore!.hasModel;

    return (
      <StyledForm onSubmit={this.handleSubmit} performLoading={trackerStore!.performLoading}>
        <div>
          {
            !skillFormStore!.hasModel &&
            <div style={{marginTop: '1rem'}}>
              Add Skill:
            </div>
          }
        </div>

        <StyledFormRow>
          <label htmlFor="skill-type-select">Type:</label>
          <StyledDropdown
            id="skill-type-select"
            name="skillType"
            options={allSkills().map(skill => ({value: skill, label: skill}))}
            value={skillFormStore!.state.skillType}
            onChange={this.handleChange}
            disabled={disabled}
          />
        </StyledFormRow>

        <StyledFormRow>
          <label htmlFor="skill-name-select">Name:</label>
          <StyledDropdown
            id="skill-name-select"
            name="skillId"
            options={this.getSkillNameOptions()}
            value={skillFormStore!.state.skillId}
            onChange={this.handleChange}
            disabled={disabled}
          />
        </StyledFormRow>

        <StyledFieldValidation fieldName="validDateRange" errors={skillFormStore!.errors}>
          <StyledFieldValidation fieldName="earnDate" errors={skillFormStore!.errors}>
            <StyledFormRow>
              <label htmlFor="earn-date">Earn Date:</label>
              <StyledDatePicker
                id="earn-date"
                value={skillFormStore!.state.earnDate}
                onChange={this.handleChange}
                name="earnDate"
              />
            </StyledFormRow>
          </StyledFieldValidation>

          <StyledFieldValidation fieldName="periodicDate" errors={skillFormStore!.errors}>
            <StyledFormRow>
              <label htmlFor="periodic-due">Periodic Due:</label>
              <StyledDatePicker
                id="periodic-due"
                value={skillFormStore!.state.periodicDue}
                onChange={this.handleChange}
                name="periodicDue"
              />
            </StyledFormRow>
          </StyledFieldValidation>
        </StyledFieldValidation>

        <StyledFieldValidation fieldName="lastSat" errors={skillFormStore!.errors}>
          <StyledFormRow>
            <label htmlFor="last-sat">Last Sat:</label>
            <StyledDatePicker
              id="last-sat"
              value={skillFormStore!.state.lastSat}
              onChange={this.handleChange}
              name="lastSat"
            />
          </StyledFormRow>
        </StyledFieldValidation>

        <StyledFieldValidation fieldName="currencyExpiration" errors={skillFormStore!.errors}>
          <StyledFormRow>
            <label htmlFor="currency-expiration">Currency Expiration:</label>
            <StyledDatePicker
              id="currency-expiration"
              value={skillFormStore!.state.currencyExpiration}
              onChange={this.handleChange}
              name="currencyExpiration"
            />
          </StyledFormRow>
        </StyledFieldValidation>

        <StyledFormRow reversed={true}>
          <StyledSubmitButton text="CONFIRM"/>
          {
            skillFormStore!.hasModel &&
            <StyledButton
              text="DELETE"
              onClick={this.handleDelete}
              renderIcon={() => <DeleteIcon/>}
            />
          }
        </StyledFormRow>
      </StyledForm>
    );
  }

  private getSkillNameOptions = () => {
    const {skillFormStore} = this.props;
    const {state, qualificationOptions} = skillFormStore!;
    switch (state.skillType) {
      case SkillType.Certification:
        return skillFormStore!.certificationOptions;
      case SkillType.Qualification:
        return qualificationOptions;
      default:
        return [];
    }
  }
}

export const StyledSkillsForm = inject(
  'skillFormStore',
  'currencyStore',
  'trackerStore',
  'locationFilterStore',
  'skillActions'
)(styled(SkillsForm)`  
  min-width: ${props => props.theme.sidePanelWidth};
`);
