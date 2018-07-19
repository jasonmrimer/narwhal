import * as React from 'react';
import styled from 'styled-components';
import { StyledDatePicker } from '../widgets/inputs/DatePicker';
import { allSkills, SkillType } from './models/SkillType';
import { StyledButton } from '../widgets/buttons/Button';
import { StyledFieldValidation } from '../widgets/inputs/FieldValidation';
import { inject, observer } from 'mobx-react';
import { StyledSubmitButton } from '../widgets/forms/SubmitButton';
import { StyledForm, StyledFormRow } from '../widgets/forms/Form';
import { DeleteIcon } from '../icons/DeleteIcon';
import { SkillFormStore } from './stores/SkillFormStore';
import { CurrencyStore } from '../currency/stores/CurrencyStore';
import { TrackerStore } from '../tracker/stores/TrackerStore';
import { LocationFilterStore } from '../widgets/stores/LocationFilterStore';
import { SkillActions } from './SkillActions';
import { StyledSingleTypeahead } from '../widgets/inputs/SingleTypeahead';

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
    console.log(target.label + " " + target.value);
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

        <div className={"filter-container"}>
          <label htmlFor="skill-type-filter">Type:</label>
          <StyledSingleTypeahead
            options={allSkills().map(skill => ({value: skill, label: skill}))}
            onChange={async () => {
              await trackerStore!.performLoading(async () => {
                await skillFormStore!.setSelectedSkillType;
              });
            }}
            className="skill-type-filter"
            clearButton={false}
            placeholder="All Sites"
            selected={{value:1, label:"Qualification"}}
            filterBy={() => {
              return true;
            }}
            disabled={disabled}
          />
        </div>

        {/*<StyledFormRow>*/}
          {/*<StyledDropdown*/}
            {/*value={skillFormStore!.state.skillType}*/}
          {/*/>*/}
        {/*</StyledFormRow>*/}

        <div className={"filter-container"}>
          <label htmlFor="skill-name-filter">Name:</label>
          <StyledSingleTypeahead
            options={this.getSkillNameOptions()}
            onChange={async () => {
              await trackerStore!.performLoading(async () => {
                await skillFormStore!.setSelectedSkill;
              });
            }}
            className="skill-name-filter"
            clearButton={false}
            placeholder="All Sites"
            selected={{value:-1, label:""}}
            filterBy={() => {
              return true;
            }}
            disabled={disabled}
          />
        </div>

        {/*<StyledFormRow>*/}
          {/*<StyledDropdown*/}
            {/*value={skillFormStore!.state.skillId}*/}
          {/*/>*/}
        {/*</StyledFormRow>*/}

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
