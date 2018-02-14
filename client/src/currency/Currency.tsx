import * as React from 'react';
import styled from 'styled-components';
import { TrackerStore } from '../tracker/stores/TrackerStore';
import { observer } from 'mobx-react';
import { AirmanModel } from '../airman/models/AirmanModel';
import { Skill } from '../skills/models/Skill';
import { StyledSkillsForm } from '../skills/SkillsForm';
import { StyledSkillTile } from '../skills/SkillTile';

interface Props {
  trackerStore: TrackerStore;
  className?: string;
}

@observer
export class Currency extends React.Component<Props> {
  render() {
    return (
      <div className={this.props.className}>
        {
          this.props.trackerStore.currencyStore.showSkillForm ?
            this.renderSkillsForm() :
            this.renderSkillsList()
        }
      </div>
    );
  }

  private renderSkillsForm = () => {
    const airman = this.props.trackerStore.selectedAirman;
    const qualifications = this.props.trackerStore.qualifications;
    const certifications = this.props.trackerStore.certifications;
    return (
      <StyledSkillsForm
        airmanId={airman.id}
        qualifications={qualifications}
        certifications={certifications}
        skill={this.props.trackerStore.currencyStore.selectedSkill}
        handleSubmit={this.createAirmanSkill}
        handleDelete={this.deleteAirmanSkill}
        errors={this.props.trackerStore.currencyStore.errors}
      />
    );
  }

  private createAirmanSkill = async (skill: Skill) => {
    await this.props.trackerStore.addAirmanSkill(skill);
    if (this.props.trackerStore.currencyStore.errors == null) {
        this.props.trackerStore.currencyStore.clearSelectedSkill();
        this.props.trackerStore.currencyStore.setShowSkillForm(false);
    }
  }

  private deleteAirmanSkill = async (skill: Skill) => {
    await this.props.trackerStore.deleteAirmanSkill(skill);
    this.props.trackerStore.currencyStore.clearSelectedSkill();
    this.props.trackerStore.currencyStore.setShowSkillForm(false);
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
      <StyledSkillTile
        key={index}
        skill={qual}
        handleClick={() => this.openSkillFormForEdit(qual)}
      />
    ));
  }

  private renderCertifications = (airman: AirmanModel) => {
    return airman.certifications.map((cert, index) => (
      <StyledSkillTile
        key={index}
        skill={cert}
        handleClick={() => this.openSkillFormForEdit(cert)}
      />
    ));
  }

  private openSkillFormForCreate = () => {
    this.props.trackerStore.currencyStore.clearSelectedSkill();
    this.props.trackerStore.currencyStore.setShowSkillForm(true);
  }

  private openSkillFormForEdit = (skill: Skill) => {
    this.props.trackerStore.currencyStore.setSelectedSkill(skill);
    this.props.trackerStore.currencyStore.setShowSkillForm(true);
  }
}

export const StyledCurrency = styled(Currency)`
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
