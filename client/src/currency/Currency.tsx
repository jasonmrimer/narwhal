import * as React from 'react';
import styled from 'styled-components';
import { inject, observer } from 'mobx-react';
import { CurrencyChild, CurrencyStore } from './stores/CurrencyStore';
import { StyledSkillsForm } from '../skills/SkillsForm';
import { StyledRipItemsTile } from '../rip-items/RipItemsTile';
import { StyledRipItems } from '../rip-items/AirmanRipItemForm';
import { StyledSkillTile } from '../skills/SkillTile';
import { StyledNotification } from '../widgets/Notification';
import { StyledBackButton } from '../widgets/BackButton';
import { AirmanRipItemFormStore } from '../rip-items/stores/AirmanRipItemFormStore';
import { SkillFormStore } from '../skills/stores/SkillFormStore';
import { TrackerStore } from '../tracker/stores/TrackerStore';

interface Props {
  currencyStore?: CurrencyStore;
  airmanRipItemFormStore?: AirmanRipItemFormStore;
  trackerStore?: TrackerStore;
  skillFormStore?: SkillFormStore;
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
    const {currencyStore, skillFormStore} = this.props;
    const {openCreateSkillForm} = currencyStore!;
    return (
      <div>
        <div className="skill-control-row">
          <button
            className="add-skill"
            onClick={() => {
              openCreateSkillForm();
              skillFormStore!.open();
            }}
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
    const {currencyStore, airmanRipItemFormStore} = this.props;
    return (
      <StyledRipItemsTile
        title="RIP TASKS"
        onClick={() => {
          airmanRipItemFormStore!.setRipItems(currencyStore!.airmanRipItems);
          currencyStore!.openAirmanRipItemForm();
        }}
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
    const {currencyStore, skillFormStore} = this.props;
    const {openEditSkillForm} = currencyStore!;
    return this.props.trackerStore!.selectedAirman.qualifications.map((qual, index) => (
      <StyledSkillTile
        key={index}
        skill={qual}
        onClick={() => {
          openEditSkillForm();
          skillFormStore!.open(qual);
        }}
      />
    ));
  }

  private renderCertifications = () => {
    const {currencyStore, skillFormStore} = this.props;
    const {openEditSkillForm} = currencyStore!;
    return this.props.trackerStore!.selectedAirman.certifications.map((cert, index) => (
      <StyledSkillTile
        key={index}
        skill={cert}
        onClick={() => {
          openEditSkillForm();
          skillFormStore!.open(cert);
        }}
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
  'airmanRipItemFormStore',
  'skillFormStore',
  'trackerStore'
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
