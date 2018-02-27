import * as React from 'react';
import styled from 'styled-components';
import { QualificationModel } from './models/QualificationModel';
import * as moment from 'moment';
import { StyledDatePicker } from '../widgets/DatePicker';
import { CertificationModel } from './models/CertificationModel';
import { allSkills, SkillType } from './models/SkillType';
import { SkillBuilder } from './models/SkillBuilder';
import { Skill } from './models/Skill';
import { StyledDeleteButton } from '../widgets/DeleteButton';
import { StyledFieldValidation } from '../widgets/FieldValidation';
import { observer } from 'mobx-react';
import { StyledSubmitButton } from '../widgets/SubmitButton';
import { StyledForm, StyledFormRow } from '../widgets/Form';
import { StyledDropdown } from '../widgets/Dropdown';

interface Props {
  airmanId: number;
  qualifications: QualificationModel[];
  certifications: CertificationModel[];
  skill: Skill | null;
  handleSubmit: (skill: Skill) => void;
  handleDelete: (skill: Skill) => void;
  errors: object[];
  className?: string;
}

interface State {
  skillType: string;
  skillNameId: string;
  earnDate: string;
  expirationDate: string;
}

@observer
export class SkillsForm extends React.Component<Props, State> {
  static hydrate(skill: Skill | null, qualifications: QualificationModel[]) {
    return {
      skillType: skill ? skill.type : SkillType.Qualification,
      skillNameId: skill ? String(skill.skillId) : String(qualifications[0].id),
      earnDate: skill ? skill.earnDate.format('YYYY-MM-DD') : '',
      expirationDate: skill ? skill.expirationDate.format('YYYY-MM-DD') : ''
    };
  }

  constructor(props: Props) {
    super(props);
    this.state = SkillsForm.hydrate(props.skill, props.qualifications);
  }

  /* tslint:disable:no-any */
  handleChange = (e: any) => {
    this.setState({[e.target.name]: e.target.value});
  }

  render() {
    const disabled = this.props.skill != null;
    return (
      <StyledForm onSubmit={this.handleSubmit}>
        <div style={{marginTop: '1rem'}}>
          Add Skill:
        </div>

        <StyledFormRow>
          <label htmlFor="skill-type-select">Type:</label>
          <StyledDropdown
            id="skill-type-select"
            name="skillType"
            options={allSkills().map(skill => ({value: skill, label: skill}))}
            value={this.state.skillType}
            onChange={this.handleChange}
            disabled={disabled}
          />
        </StyledFormRow>

        <StyledFormRow>
          <label htmlFor="skill-name-select">Name:</label>
          <StyledDropdown
            id="skill-name-select"
            name="skillNameId"
            options={this.getSkillNameOptions()}
            value={this.state.skillNameId}
            onChange={this.handleChange}
            disabled={disabled}
          />
        </StyledFormRow>

        <StyledFieldValidation name="earnDate" errors={this.props.errors}>
          <StyledFormRow>
            <label htmlFor="earn-date">Earn Date:</label>
            <StyledDatePicker
              id="earn-date"
              value={this.state.earnDate}
              onChange={this.handleChange}
              disabled={disabled}
              name="earnDate"
            />
          </StyledFormRow>
        </StyledFieldValidation>

        <StyledFieldValidation name="expirationDate" errors={this.props.errors}>
          <StyledFormRow>
            <label htmlFor="expiration-date">Expiration Date:</label>
            <StyledDatePicker
              id="expiration-date"
              value={this.state.expirationDate}
              onChange={this.handleChange}
              name="expirationDate"
            />
          </StyledFormRow>
        </StyledFieldValidation>

        <StyledFormRow reversed={true}>
          <StyledSubmitButton text="CONFIRM"/>
          {this.props.skill && <StyledDeleteButton className="delete" handleClick={this.handleDelete}/>}
        </StyledFormRow>
      </StyledForm>
    );
  }

  private getSkillNameOptions = () => {
    switch (this.state.skillType) {
      case SkillType.Certification:
        return this.props.certifications.map(cert => {
          return {value: cert.id, label: cert.title};
        });
      case SkillType.Qualification:
      default:
        return this.props.qualifications.map(qual => {
          return {value: qual.id, label: `${qual.acronym} - ${qual.title}`};
        });
    }
  }

  private handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const builder = new SkillBuilder()
      .setAirmanId(this.props.airmanId)
      .setEarnDate(moment(this.state.earnDate))
      .setExpirationDate(moment(this.state.expirationDate))
      .setSkill(this.getSkillById());

    if (this.props.skill != null && this.props.skill.id) {
      builder.setId(this.props.skill.id);
    }

    this.props.handleSubmit(builder.build());
  }

  private handleDelete = (clickEvent: React.MouseEvent<HTMLButtonElement>) => {
    clickEvent.preventDefault();
    if (this.props.skill == null) {
      return;
    }
    this.props.handleDelete(this.props.skill);
  }

  private getSkillById() {
    const skillId = Number(this.state.skillNameId);
    switch (this.state.skillType) {
      case SkillType.Certification:
        return this.props.certifications.find(item => item.id === skillId)!;
      case SkillType.Qualification:
      default:
        return this.props.qualifications.find(item => item.id === skillId)!;
    }
  }
}

export const StyledSkillsForm = styled(SkillsForm)`  
  min-width: ${props => props.theme.sidePanelWidth};
`;
