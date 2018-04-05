import * as React from 'react';
import styled from 'styled-components';
import { StyledDatePicker } from '../widgets/DatePicker';
import { allSkills, SkillType } from './models/SkillType';
import { StyledButton } from '../widgets/Button';
import { StyledFieldValidation } from '../widgets/FieldValidation';
import { observer } from 'mobx-react';
import { StyledSubmitButton } from '../widgets/SubmitButton';
import { StyledForm, StyledFormRow } from '../widgets/Form';
import { StyledDropdown } from '../widgets/Dropdown';
import { DeleteIcon } from '../icons/DeleteIcon';
import { SkillFormStore } from './stores/SkillFormStore';

interface Props {
  airmanId: number;
  skillFormStore: SkillFormStore;
  className?: string;
}

@observer
export class SkillsForm extends React.Component<Props> {
  handleChange = ({target}: any) => {
    this.props.skillFormStore.setState({[target.name]: target.value});
  }

  handleDelete = () => {
    this.props.skillFormStore.removeItem();
  }

  handleSubmit = (e: any) => {
    e.preventDefault();
    this.props.skillFormStore.addItem(this.props.airmanId);
  }

  render() {
    const {state, errors, hasItem} = this.props.skillFormStore;
    const disabled = hasItem;
    return (
      <StyledForm onSubmit={this.handleSubmit}>
        <div>
          {
            !hasItem &&
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
            value={state.skillType}
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
            value={state.skillId}
            onChange={this.handleChange}
            disabled={disabled}
          />
        </StyledFormRow>

        <StyledFieldValidation name="earnDate" errors={errors}>
          <StyledFormRow>
            <label htmlFor="earn-date">Earn Date:</label>
            <StyledDatePicker
              id="earn-date"
              value={state.earnDate}
              onChange={this.handleChange}
              disabled={disabled}
              name="earnDate"
            />
          </StyledFormRow>
        </StyledFieldValidation>

        <StyledFieldValidation name="expirationDate" errors={errors}>
          <StyledFormRow>
            <label htmlFor="expiration-date">Expiration Date:</label>
            <StyledDatePicker
              id="expiration-date"
              value={state.expirationDate}
              onChange={this.handleChange}
              name="expirationDate"
            />
          </StyledFormRow>
        </StyledFieldValidation>

        <StyledFormRow reversed={true}>
          <StyledSubmitButton text="CONFIRM"/>
          {
            hasItem &&
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
    switch (this.props.skillFormStore.state.skillType) {
      case SkillType.Certification:
        return this.props.skillFormStore.certificationOptions;
      case SkillType.Qualification:
        return this.props.skillFormStore.qualificationOptions;
      default:
        return [];
    }
  }
}

export const StyledSkillsForm = styled(SkillsForm)`  
  min-width: ${props => props.theme.sidePanelWidth};
`;
