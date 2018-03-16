import * as React from 'react';
import styled from 'styled-components';
import { observer } from 'mobx-react';
import { AirmanModel } from '../airman/models/AirmanModel';
import { StyledSkillsForm } from '../skills/SkillsForm';
import { StyledSkillTile } from '../skills/SkillTile';
import { CurrencyChild, CurrencyStore } from './stores/CurrencyStore';
import { StyledBackButton } from '../widgets/BackButton';
import { StyledNotification } from '../widgets/Notification';
import { StyledRipItems } from '../rip-items/AirmanRipItemForm';
import { StyledRipItemsTile } from '../rip-items/RipItemsTile';

interface Props {
  selectedAirman: AirmanModel;
  currencyStore: CurrencyStore;
  className?: string;
}

@observer
export class Currency extends React.Component<Props> {
  async componentDidMount() {
    this.props.currencyStore.closeSkillForm();
  }

  async componentWillReceiveProps() {
    this.props.currencyStore.closeSkillForm();
  }

  render() {
    return (
      <div className={this.props.className}>
        {this.renderCurrencyChild()}
      </div>
    );
  }

  private renderCurrencyChild = () => {
    switch (this.props.currencyStore.currencyChild) {
      case CurrencyChild.SkillForm:
        return this.renderSkillsForm();
      case CurrencyChild.RipItemForm:
        return this.renderRipItems();
      case CurrencyChild.SkillList:
      default:
        return this.renderSkillsList();
    }
  }

  private renderSkillsForm = () => {
    return (
      <div>
        {this.renderBackButton()}
        <StyledSkillsForm
          airmanId={this.props.selectedAirman.id}
          skillFormStore={this.props.currencyStore.skillFormStore}
        />
      </div>
    );
  }

  private renderSkillsList = () => {
    return (
      <div>
        <div className="skill-control-row">
          <button className="add-skill" onClick={this.props.currencyStore.openCreateSkillForm}>
            + Add Skill
          </button>
        </div>
        {this.renderRip()}
        {this.renderQualifications()}
        {this.renderCertifications()}
        {this.renderSkillNotification()}
      </div>
    );
  }

  private renderRip = () => {
    return (
      <StyledRipItemsTile
        title="RIP TASKS"
        onClick={this.props.currencyStore.openAirmanRipItemForm}
      />
    );
  }

  private renderRipItems = () => {
    return (
      <div>
        {this.renderBackButton()}
        <StyledRipItems
          selectedAirmanId={this.props.selectedAirman.id}
          store={this.props.currencyStore.airmanRipItemFormStore}
        />
      </div>
    );
  }

  private renderQualifications = () => {
    return this.props.selectedAirman.qualifications.map((qual, index) => (
      <StyledSkillTile
        key={index}
        skill={qual}
        onClick={() => this.props.currencyStore.openEditSkillForm(qual)}
      />
    ));
  }

  private renderCertifications = () => {
    return this.props.selectedAirman.certifications.map((cert, index) => (
      <StyledSkillTile
        key={index}
        skill={cert}
        onClick={() => this.props.currencyStore.openEditSkillForm(cert)}
      />
    ));
  }

  private renderSkillNotification = () => {
    if (this.props.selectedAirman.qualifications.length === 0 &&
      this.props.selectedAirman.certifications.length === 0) {
      return <StyledNotification>This Airman has no associated skills.</StyledNotification>;
    }
    return;
  }

  private renderBackButton = () => {
    return (
      <StyledBackButton
        onClick={() => this.props.currencyStore.closeSkillForm()}
        text="Back to Overview"
      />
    );
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
