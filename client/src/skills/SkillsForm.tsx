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

  render() {
    const disabled = this.props.skill != null;
    return (
      <form className={this.props.className} onSubmit={this.handleSubmit}>
        <div style={{marginTop: '1rem'}}>
          Add Skill:
        </div>

        <div className="input-wrapper">
          <div className="form-row">
            <label htmlFor="skill-type-select">Type:</label>
            <select
              id="skill-type-select"
              name="skillType"
              value={this.state.skillType}
              disabled={disabled}
              onChange={this.handleChange}
            >
              {
                allSkills().map((skill, index) => {
                  return <option key={index} value={skill}>{skill}</option>;
                })
              }
            </select>
          </div>

          <div className="form-row">
            <label htmlFor="skill-name-select">Name:</label>
            <select
              id="skill-name-select"
              name="skillNameId"
              value={this.state.skillNameId}
              disabled={disabled}
              onChange={this.handleChange}
            >
              {this.renderSkillNameOptions()}
            </select>
          </div>

          <StyledFieldValidation name="earnDate" errors={this.props.errors}>
            <div className="form-row">
              <label htmlFor="earn-date">Earn Date:</label>
              <StyledDatePicker
                id="earn-date"
                dateValue={this.state.earnDate}
                onChange={this.handleChange}
                disabled={disabled}
                name="earnDate"
              />
            </div>
          </StyledFieldValidation>

          <StyledFieldValidation name="expirationDate" errors={this.props.errors}>
            <div className="form-row">
              <label htmlFor="expiration-date">Expiration Date:</label>
              <StyledDatePicker
                id="expiration-date"
                dateValue={this.state.expirationDate}
                onChange={this.handleChange}
                name="expirationDate"
              />
            </div>
          </StyledFieldValidation>

          <div className="form-row">
            {this.props.skill && <StyledDeleteButton handleClick={this.handleDelete}/>}
            <StyledSubmitButton text="CONFIRM"/>
          </div>
        </div>
      </form>
    );
  }

  private renderSkillNameOptions = () => {
    switch (this.state.skillType) {
      case SkillType.Certification:
        return this.props.certifications.map((cert, index) => {
          return <option key={`cert-${index}`} value={cert.id}>{cert.title}</option>;
        });
      case SkillType.Qualification:
      default:
        return this.props.qualifications.map((qual, index) => {
          return <option key={`qual-${index}`} value={qual.id}>{qual.acronym} - {qual.title}</option>;
        });
    }
  }

  /* tslint:disable:no-any */
  private handleChange = (e: any) => {
    this.setState({[e.target.name]: e.target.value});
  }

  private handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const builder = new SkillBuilder()
      .setAirmanId(this.props.airmanId)
      .setEarnDate(moment.utc(this.state.earnDate))
      .setExpirationDate(moment.utc(this.state.expirationDate))
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

const caret = (fillColor: string) => {
  return `url("data:image/svg+xml;utf8,
    <svg xmlns='http://www.w3.org/2000/svg' width='100' height='50' fill='${fillColor}'>
        <polygon points='0,0 100,0 50,50'/>
    </svg>")
    no-repeat center right`;
};

export const StyledSkillsForm = styled(SkillsForm)`
  text-align: left;
  display: flex;
  flex-direction: column;
  color: ${props => props.theme.graySteel};
  
  .form-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    &:last-of-type {
      margin-top: 1rem;
      align-items: baseline;
    };
    
    label {
      margin-right: 1rem;
    }
  }
  
  .input-wrapper {
    margin: 1rem ;
  }
  
  select {
    background-color: ${props => props.theme.dark};
    background: ${props => caret(props.theme.fontColor)};
    background-position: 98%;
    background-size: 0.75rem;
    color: ${props => props.theme.fontColor};
    height: 2rem;
    border: none;
    font-size: 1rem;
    border-bottom: 1px solid ${props => props.theme.fontColor};
    -webkit-appearance: none;
    -webkit-border-radius: 0;
    width: 75%;
    
    &:disabled {
      color: ${props => props.theme.graySteel};
      background: none;
      border-bottom: 1px solid ${props => props.theme.graySteel};
    }
  }
`;
