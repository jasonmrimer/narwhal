import * as React from 'react';
import AirmanQualificationModel from '../../airman/models/AirmanQualificationModel';
import styled from 'styled-components';
import QualificationModel from '../../skills/models/QualificationModel';
import * as moment from 'moment';
import DatePicker from '../../widgets/DatePicker';
import SubmitButton from '../../widgets/SubmitButton';
import CertificationModel from '../../skills/models/CertificationModel';
import AirmanCertificationModel from '../../airman/models/AirmanCertificationModel';
import { allSkills, SkillType } from '../../skills/models/SkillType';
import SkillBuilder from '../../skills/models/SkillBuilder';

interface Props {
  airmanId: number;
  qualifications: QualificationModel[];
  certifications: CertificationModel[];
  createAirmanSkill: (skill: AirmanQualificationModel | AirmanCertificationModel) => void;
  className?: string;
}

interface State {
  skillTypeIndex: string;
  skillNameIndex: string;
  earnDate: string;
  expirationDate: string;
}

export class CurrencyForm extends React.Component<Props, State> {
  static hydrate() {
    return {
      skillTypeIndex: '',
      skillNameIndex: '',
      earnDate: '',
      expirationDate: ''
    };
  }

  constructor(props: Props) {
    super(props);
    this.state = CurrencyForm.hydrate();
  }

  render() {
    return (
      <form className={this.props.className} onSubmit={this.handleSubmit}>
        <div style={{marginTop: '1rem'}}>
          Add Skill:
        </div>
        <div className="form-row">
          <label htmlFor="skill-type-select">Type:</label>
          <select
            id="skill-type-select"
            name="skillTypeIndex"
            value={this.state.skillTypeIndex}
            onChange={this.handleChange}
          >
            {
              allSkills().map((skill, index) => {
                return <option key={index} value={index}>{skill}</option>;
              })
            }
          </select>
        </div>
        <div className="form-row">
          <label htmlFor="skill-name-select">Name:</label>
          <select
            id="skill-name-select"
            name="skillNameIndex"
            value={this.state.skillNameIndex}
            onChange={this.handleChange}
          >
            {this.renderSkillNameOptions()}
          </select>
        </div>
        <div className="form-row">
          <label htmlFor="earn-date">Earn Date:</label>
          <DatePicker
            id="earn-date"
            dateValue={this.state.earnDate}
            onChange={this.handleChange}
            name="earn"
          />
        </div>
        <div className="form-row">
          <label htmlFor="expiration-date">Expiration Date:</label>
          <DatePicker
            id="expiration-date"
            dateValue={this.state.expirationDate}
            onChange={this.handleChange}
            name="expiration"
          />
        </div>
        <SubmitButton text="CONFIRM"/>
      </form>
    );
  }

  private renderSkillNameOptions = () => {
    switch (this.selectedSkill) {
      case SkillType.Certification:
        return this.props.certifications.map((cert, index) => {
          return <option key={index} value={index}>{cert.title}</option>;
        });
      case SkillType.Qualification:
      default:
        return this.props.qualifications.map((qual, index) => {
          return <option key={index} value={index}>{`${qual.acronym} - ${qual.title}`}</option>;
        });
    }
  }

  private get selectedSkill() {
    return allSkills()[Number(this.state.skillTypeIndex)];
  }

  /* tslint:disable:no-any */
  private handleChange = (e: any) => {
    this.setState({[e.target.name]: e.target.value});
  }

  private handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const builder = new SkillBuilder();
    builder.airmanId = this.props.airmanId;
    builder.earnDate = moment.utc(this.state.earnDate);
    builder.expirationDate = moment.utc(this.state.expirationDate);

    switch (this.selectedSkill) {
      case SkillType.Certification:
        builder.skill = this.props.certifications[Number(this.state.skillNameIndex)];
        break;
      case SkillType.Qualification:
      default:
        builder.skill = this.props.qualifications[Number(this.state.skillNameIndex)];
        break;
    }

    this.props.createAirmanSkill(builder.build());
  }
}

const caret = (fillColor: string) => {
  return `url("data:image/svg+xml;utf8,
    <svg xmlns='http://www.w3.org/2000/svg' width='100' height='50' fill='${fillColor}'>
        <polygon points='0,0 100,0 50,50'/>
    </svg>")
    no-repeat center right`;
};

export default styled(CurrencyForm)`
  text-align: left;
  display: flex;
  flex-direction: column;
  color: ${props => props.theme.graySteel};
  
  .form-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 1rem 1rem 0;
    
    label {
      margin-right: 1rem;
      width: 25%;
    }
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
  }
`;
