import * as React from 'react';
import styled from 'styled-components';
import { observer } from 'mobx-react';
import { AirmanModel } from '../airman/models/AirmanModel';
import { StyledSkillsForm } from '../skills/SkillsForm';
import { StyledSkillTile } from '../skills/SkillTile';
import { CurrencyStore } from './stores/CurrencyStore';

interface Props {
  selectedAirman: AirmanModel;
  currencyStore: CurrencyStore;
  className?: string;
}

@observer
export class Currency extends React.Component<Props> {
  componentDidMount() {
    this.props.currencyStore.closeSkillForm();
  }

  componentWillReceiveProps() {
    this.props.currencyStore.closeSkillForm();
  }

  render() {
    return (
      <div className={this.props.className}>
        {
          this.props.currencyStore.shouldShowSkillForm ?
            this.renderSkillsForm() :
            this.renderSkillsList()
        }
      </div>
    );
  }

  private renderSkillsForm = () => {
    return (
      <StyledSkillsForm
        airmanId={this.props.selectedAirman.id}
        skillFormStore={this.props.currencyStore.skillFormStore}
      />
    );
  }

  private renderSkillsList = () => {
    const airman = this.props.selectedAirman;
    return (
      <div>
        <div className="skill-control-row">
          <button className="add-skill" onClick={this.props.currencyStore.openCreateSkillForm}>
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
        onClick={() => this.props.currencyStore.openEditSkillForm(qual)}
      />
    ));
  }

  private renderCertifications = (airman: AirmanModel) => {
    return airman.certifications.map((cert, index) => (
      <StyledSkillTile
        key={index}
        skill={cert}
        onClick={() => this.props.currencyStore.openEditSkillForm(cert)}
      />
    ));
  }
}

export const StyledCurrency = styled(Currency)`
  width: 100%;
  
  .skill-control-row {
    display: flex;
    justify-content: flex-end;

    .add-skill {
      font-size: 16px;
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
