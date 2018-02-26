import * as React from 'react';
import styled from 'styled-components';
import { MissionFormStore } from './stores/MissionFormStore';
import { observer } from 'mobx-react';
import { StyledDatePicker } from '../widgets/DatePicker';
import { StyledTimeInput } from '../widgets/TimeInput';
import { StyledSubmitButton } from '../widgets/SubmitButton';
import { StyledDeleteButton } from '../widgets/DeleteButton';
import { StyledMultiSelect } from '../widgets/MultiSelect';
import { MissionStore } from '../mission/stores/MissionStore';
import { FilterOption } from '../widgets/models/FilterOptionModel';
import { StyledFieldValidation } from '../widgets/FieldValidation';

/* tslint:disable:no-empty*/
function noop() {
}

interface Props {
  airmanId: number;
  missionStore: MissionStore;
  missionFormStore: MissionFormStore;
  className?: string;
}

@observer
export class MissionForm extends React.Component<Props> {
  handleChange = (option: FilterOption[]) => {
    if (option.length === 0) {
      this.props.missionFormStore.setState(null);
      return;
    }

    const mission = this.props.missionStore.missions
      .find(msn => msn.missionId === option[0].value);

    if (mission != null) {
      this.props.missionFormStore.setState(mission);
    }
  }

  handleDelete = () => {
    this.props.missionFormStore.removeMission();
  }

  /* tslint:disable:no-any*/
  handleSubmit = (e: any) => {
    e.preventDefault();
    this.props.missionFormStore.addMission(this.props.airmanId);
  }

  render() {
    const {missionOptions} = this.props.missionStore;
    const {state, hasEvent, errors} = this.props.missionFormStore;
    const selected = missionOptions.find(msn => msn.label === state.missionId);

    return (
      <form className={this.props.className} onSubmit={this.handleSubmit}>
        <div className="input-row">
          <StyledFieldValidation name="title" errors={errors} className="mission-select-row">
            <StyledMultiSelect
              selected={selected != null ? [selected] : undefined}
              disabled={hasEvent}
              multiple={false}
              options={missionOptions}
              onChange={this.handleChange}
              placeholder="Mission ID"
            />
          </StyledFieldValidation>
        </div>

        <div className="input-row">
          <StyledDatePicker
            name="startDate"
            disabled={true}
            onChange={noop}
            value={state.startDate}
          />
          <StyledTimeInput
            name="startTime"
            disabled={true}
            onChange={noop}
            value={state.startTime}
          />
        </div>

        <div className="input-row">
          <StyledDatePicker
            name="endDate"
            disabled={true}
            onChange={noop}
            value={state.endDate}
          />
          <StyledTimeInput
            name="endTime"
            disabled={true}
            onChange={noop}
            value={state.endTime}
          />
        </div>

        <div className="form-row">
          {hasEvent && <StyledDeleteButton handleClick={this.handleDelete}/>}
          {!hasEvent && <StyledSubmitButton text="CONFIRM"/>}
        </div>
      </form>
    );
  }
}

export const StyledMissionForm = styled(MissionForm)`
 text-align: left;
 display: flex;
 flex-direction: column;
 color: ${props => props.theme.graySteel};

 .form-wrapper {
  margin: 0 1rem;
 }

 .input-row {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
 }
 
 .mission-select-row {
  width: 100%;
 }

 .form-row {
  display: flex;
  margin-top: 2rem;
  align-items: baseline;
  justify-content: space-between;
 }

 .styled-select {
  margin: 1rem 1rem 0;
 }
`;