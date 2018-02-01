import * as React from 'react';
import AirmanQualificationModel from '../../airman/models/AirmanQualificationModel';
import styled from 'styled-components';
import QualificationModel from '../../qualifications/models/QualificationModel';
import * as moment from 'moment';
import DatePicker from '../../widgets/DatePicker';
import SubmitButton from '../../widgets/SubmitButton';

interface Props {
  airmanId: number;
  qualifications: QualificationModel[];
  createAirmanQualification: (airmanQual: AirmanQualificationModel) => void;
  className?: string;
}

interface State {
  qualificationIndex: string;
  earnDate: string;
  expirationDate: string;
}

export class CurrencyForm extends React.Component<Props, State> {
  static hydrate() {
    return {
      qualificationIndex: '',
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
          <label>Type:</label>
          <span>Qualification</span>
        </div>
        <div className="form-row">
          <label htmlFor="qualification-select">Name:</label>
          <select
            id="qualification-select"
            name="qualificationIndex"
            value={this.state.qualificationIndex}
            onChange={this.handleChange}
          >
            {
              this.props.qualifications.map((qual, index) => {
                return <option key={index} value={index}>{qual.acronym}</option>;
              })
            }
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

  handleChange = (e: any) => {
    this.setState({[e.target.name]: e.target.value});
  }

  handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const airmanQual = new AirmanQualificationModel(
      this.props.airmanId,
      this.props.qualifications[Number(this.state.qualificationIndex)],
      moment.utc(this.state.earnDate),
      moment.utc(this.state.expirationDate)
    );
    this.props.createAirmanQualification(airmanQual);
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
    margin: 1rem 1rem 0;
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
    min-width: 9.75rem;
  }
`;
