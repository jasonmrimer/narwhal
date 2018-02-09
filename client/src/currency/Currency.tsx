import * as React from 'react';
import styled from 'styled-components';
import TrackerStore from '../tracker/stores/TrackerStore';
import { observer } from 'mobx-react';
import SkillsForm from '../skills/SkillsForm';
import AirmanModel from '../airman/models/AirmanModel';
import SkillTile from '../skills/SkillTile';
import { Skill } from '../skills/models/Skill';

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
        {this.state.showForm ? this.renderSkillsForm() : this.renderSkillsList()}
      </div>
    );
  }

  private renderSkillsForm = () => {
    const airman = this.props.trackerStore.selectedAirman;
    const qualifications = this.props.trackerStore.qualifications;
    const certifications = this.props.trackerStore.certifications;
    return (
      <SkillsForm
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

  private renderSkillsList = () => {
    const airman = this.props.trackerStore.selectedAirman;
    return (
      <div>
        <div className="skill-control-row">
          <button className="add-skill" onClick={this.openSkillFormForCreate}>
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
      <SkillTile
        key={index}
        skill={qual}
        handleClick={() => this.openSkillFormForEdit(qual)}
      />
    ));
  }

  private renderCertifications = (airman: AirmanModel) => {
    return airman.certifications.map((cert, index) => (
      <SkillTile
        key={index}
        skill={cert}
        handleClick={() => this.openSkillFormForEdit(cert)}
      />
    ));
  }

  private openSkillFormForCreate = () => {
    this.setState({showForm: true, selectedSkill: null});
  }

  private openSkillFormForEdit = (skill: Skill) => {
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
      background-color: ${props => props.theme.lighter};
      border: none;
      cursor: pointer;
      
      :hover{
        background: ${props => props.theme.fontColor};
        color: ${props => props.theme.darkest};
      }
    }
  }
`;
