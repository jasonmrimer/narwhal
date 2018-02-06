import * as React from 'react';
import styled from 'styled-components';
import TrackerStore from '../stores/TrackerStore';
import { observer } from 'mobx-react';
import CurrencyForm from './CurrencyForm';
import AirmanModel from '../../airman/models/AirmanModel';
import CurrencyTile from './CurrencyTile';
import { Skill } from '../../skills/models/Skill';

interface Props {
  trackerStore: TrackerStore;
  className?: string;
}

interface State {
  showForm: boolean;
  selectedSkill: Skill | null;
}

@observer
export class Currency extends React.Component<Props, State> {
  state = {
    showForm: false,
    selectedSkill: null
  };

  componentWillReceiveProps() {
    this.setState({showForm: false});
  }

  render() {
    return (
      <div className={this.props.className}>
        {this.state.showForm ? this.renderCurrencyForm() : this.renderCurrencyList()}
      </div>
    );
  }

  private renderCurrencyForm = () => {
    const airman = this.props.trackerStore.selectedAirman;
    const qualifications = this.props.trackerStore.qualifications;
    const certifications = this.props.trackerStore.certifications;
    return (
      <CurrencyForm
        airmanId={airman.id}
        qualifications={qualifications}
        certifications={certifications}
        skill={this.state.selectedSkill}
        handleSubmit={this.createAirmanSkill}
        handleDelete={this.deleteAirmanSkill}
      />
    );
  }

  private createAirmanSkill = async (skill: Skill) => {
    await this.props.trackerStore.addAirmanSkill(skill);
    this.setState({showForm: false, selectedSkill: null});
  }

  private deleteAirmanSkill = async (skill: Skill) => {
    await this.props.trackerStore.deleteAirmanSkill(skill);
    this.setState({showForm: false, selectedSkill: null});
  }

  private renderCurrencyList = () => {
    const airman = this.props.trackerStore.selectedAirman;
    return (
      <div>
        <div className="skill-control-row">
          <button className="add-skill" onClick={this.openCurrencyFormForCreate}>
            + Add Skill
          </button>
        </div>
        {this.renderQualifications(airman)}
        {this.renderCertifications(airman)}
      </div>
    );
  }

  private renderQualifications = (airman: AirmanModel) => {
    return airman.qualifications.map((qual, index) => (
      <CurrencyTile
        key={index}
        skill={qual}
        handleClick={() => this.openCurrencyFormForEdit(qual)}
      />
    ));
  }

  private renderCertifications = (airman: AirmanModel) => {
    return airman.certifications.map((cert, index) => (
      <CurrencyTile
        key={index}
        skill={cert}
        handleClick={() => this.openCurrencyFormForEdit(cert)}
      />
    ));
  }

  private openCurrencyFormForCreate = () => {
    this.setState({showForm: true, selectedSkill: null});
  }

  private openCurrencyFormForEdit = (skill: Skill) => {
    this.setState({showForm: true, selectedSkill: skill});
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
`;
