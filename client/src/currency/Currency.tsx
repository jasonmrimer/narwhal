import * as React from 'react';
import styled from 'styled-components';
import { inject, observer } from 'mobx-react';
import { CurrencyChild, CurrencyStore } from './stores/CurrencyStore';
import { StyledSkillsForm } from '../skills/SkillsForm';
import { StyledSkillTile } from '../skills/SkillTile';
import { StyledNotification } from '../widgets/Notification';
import { StyledBackButton } from '../widgets/BackButton';
import { TrackerStore } from '../tracker/stores/TrackerStore';
import { StyledRipItems } from '../rip-item/AirmanRipItemForm';
import { StyledRipItemsTile } from '../rip-item/RipItemsTile';
import { CurrencyActions } from './CurrencyActions';

interface Props {
  currencyStore?: CurrencyStore;
  trackerStore?: TrackerStore;
  currencyActions?: CurrencyActions;
  className?: string;
}

@observer
export class Currency extends React.Component<Props> {
  render() {
    return (
      <div className={this.props.className}>
        {this.renderCurrencyChild()}
      </div>
    );
  }

  private renderCurrencyChild = () => {
    switch (this.props.currencyStore!.currencyChild) {
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
          airmanId={this.props.trackerStore!.selectedAirman.id}
        />
      </div>
    );
  }

  private renderSkillsList = () => {
    return (
      <div>
        <div className="skill-control-row">
          <button
            className="add-skill"
            onClick={this.props.currencyActions!.addSkill}
          >
            + Add Skill
          </button>
        </div>
        {this.renderRipTile()}
        {this.renderQualifications()}
        {this.renderCertifications()}
        {this.renderSkillNotification()}
      </div>
    );
  }

  private renderRipTile = () => {
    const {currencyStore} = this.props;
    return (
      <StyledRipItemsTile
        title="RIP TASKS"
        onClick={this.props.currencyActions!.addRipItems}
        expiredItemCount={currencyStore!.expiredItemCount}
        assignedItemCount={currencyStore!.assignedItemCount}
      />
    );
  }

  private renderRipItems = () => {
    return (
      <div>
        {this.renderBackButton()}
        <StyledRipItems
          selectedAirmanId={this.props.trackerStore!.selectedAirman.id}
        />
      </div>
    );
  }

  private renderQualifications = () => {
    return this.props.trackerStore!.selectedAirman.qualifications.map((qual, index) => (
      <StyledSkillTile
        key={index}
        skill={qual}
        onClick={() => this.props.currencyActions!.editSkill(qual)}
      />
    ));
  }

  private renderCertifications = () => {
    return this.props.trackerStore!.selectedAirman.certifications.map((cert, index) => (
      <StyledSkillTile
        key={index}
        skill={cert}
        onClick={() => this.props.currencyActions!.editSkill(cert)}
      />
    ));
  }

  private renderSkillNotification = () => {
    if (this.props.trackerStore!.selectedAirman.qualifications.length === 0 &&
      this.props.trackerStore!.selectedAirman.certifications.length === 0) {
      return <StyledNotification>This Airman has no associated skills.</StyledNotification>;
    }
    return;
  }

  private renderBackButton = () => {
    const {currencyStore} = this.props;
    const {closeSkillForm} = currencyStore!;
    return (
      <StyledBackButton
        onClick={closeSkillForm}
        text="Back to Overview"
      />
    );
  }
}

export const StyledCurrency = inject(
  'currencyStore',
  'trackerStore',
  'currencyActions'
)(styled(Currency)`
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
`);
