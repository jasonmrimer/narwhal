import * as React from 'react';
import styled from 'styled-components';
import { Moment } from 'moment';
import TrackerStore from '../stores/TrackerStore';
import { observer } from 'mobx-react';
import CurrencyForm from './CurrencyForm';
import AirmanQualificationModel from '../../airman/models/AirmanQualificationModel';

interface Props {
  trackerStore: TrackerStore;
  className?: string;
}

interface State {
  showForm: boolean;
}

const list = (label: string, expiration: Moment, index: number) => {
  return (
    <div className="currency-tile" key={index}>
      <div className="currency-title">{label}</div>
      <div className="currency-description"> {expiration.format('DD MMM YY')}</div>
    </div>
  );
};

@observer
export class Currency extends React.Component<Props, State> {
  state = {
    showForm: false
  };

  componentWillReceiveProps() {
    this.setState({showForm: false});
  }

  createAirmanQualification = async (airmanQual: AirmanQualificationModel) => {
    await this.props.trackerStore.addAirmanQualification(airmanQual);
    this.setState({showForm: false});
  }

  renderCurrencyForm = () => {
    const airman = this.props.trackerStore.selectedAirman;
    const qualifications = this.props.trackerStore.qualifications;
    return (
      <CurrencyForm
        airmanId={airman.id}
        qualifications={qualifications}
        createAirmanQualification={this.createAirmanQualification}
      />
    );
  }

  renderCurrencyList = () => {
    const airman = this.props.trackerStore.selectedAirman;
    return (
      <div>
        <div className="skill-control-row">
          <button className="add-skill" onClick={() => this.setState({showForm: true})}>
            + Add Skill
          </button>
        </div>
        {
          airman.qualifications.map((qualification, index) => (
            list(qualification.acronym, qualification.expirationDate, index)))
        }
        {
          airman.certifications.map((certification, index) => (
            list(certification.title, certification.expirationDate, index)))
        }
      </div>
    );
  }

  render() {
    return (
      <div className={this.props.className}>
        {this.state.showForm ? this.renderCurrencyForm() : this.renderCurrencyList()}
      </div>
    );
  }
}

export default styled(Currency)`
  width: 100%;
  
  .skill-control-row {
    display: flex;
    justify-content: flex-end;

    .add-skill {
      font-size: 12px;
      margin: 0.5rem 1rem;
      color: ${props => props.theme.fontColor};
      
      :hover{
        background: ${props => props.theme.fontColor};
        color: ${props => props.theme.darkest};
      }
    }
  }
  
  .currency-tile {
    background: ${props => props.theme.blueSteel};
    margin: 0.5rem 0;
    padding: 1px;
  }
  
  .currency-title {
    padding: 0.35rem;
  }

  .currency-description {
    background: ${props => props.theme.lighter};
    font-size: 12px;
    padding: 0.35rem;
  }
`;
