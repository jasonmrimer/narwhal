import * as React from 'react';
import styled from 'styled-components';
import { MissionFormStore } from './stores/MissionFormStore';
import { inject, observer } from 'mobx-react';
import { StyledDatePicker } from '../widgets/DatePicker';
import { StyledTimeInput } from '../widgets/TimeInput';
import { StyledSubmitButton } from '../widgets/SubmitButton';
import { StyledButton } from '../widgets/Button';
import { StyledSingleTypeahead } from '../widgets/SingleTypeahead';
import { FilterOption } from '../widgets/models/FilterOptionModel';
import { StyledFieldValidation } from '../widgets/FieldValidation';
import { StyledForm, StyledFormRow } from '../widgets/Form';
import { DeleteIcon } from '../icons/DeleteIcon';
import { EventModel } from './models/EventModel';
import { TrackerStore } from '../tracker/stores/TrackerStore';
import { EventActions } from './EventActions';

/* tslint:disable:no-empty*/
function noop() {
}

interface Props {
  missionFormStore?: MissionFormStore;
  trackerStore?: TrackerStore;
  airmanId: number;
  event?: EventModel;
  className?: string;
}

@observer
export class MissionForm extends React.Component<Props> {
  componentDidMount() {
    this.props.missionFormStore!.open(this.props.event);
  }

  handleChange = (opt: FilterOption | null) => {
    if (opt == null) {
      this.props.missionFormStore!.setState('id', '');
    } else {
      this.props.missionFormStore!.setState('id', String(opt.value));
    }
  }

  handleDelete = async () => {
    await EventActions.handleDeleteEvent(this.props.missionFormStore!.model!);
  }

  handleSubmit = async (e: any) => {
    e.preventDefault();
    await EventActions.handleFormSubmit(this.props.airmanId, this.props.missionFormStore!);
  }

  render() {
    const {trackerStore, missionFormStore} = this.props;
    const {missionOptions, state, hasModel, errors} = missionFormStore!;
    const selected = missionOptions.find(msn => msn.value === Number(state.id));
    return (
      <StyledForm onSubmit={this.handleSubmit} setLoading={trackerStore!.setLoading}>
        <StyledFieldValidation name="title" errors={errors}>
          <StyledFormRow>
            <StyledSingleTypeahead
              selected={selected}
              disabled={hasModel}
              options={missionOptions}
              onChange={this.handleChange}
              clearButton={true}
              placeholder="Mission ID"
            />
          </StyledFormRow>
        </StyledFieldValidation>

        <StyledFieldValidation name="validDateRange" errors={errors}>
          <StyledFormRow>
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
          </StyledFormRow>

          <StyledFormRow>
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
          </StyledFormRow>
        </StyledFieldValidation>

        <StyledFormRow reversed={!hasModel}>
          {
            hasModel &&
            <StyledButton
              text="DELETE"
              onClick={this.handleDelete}
              renderIcon={() => <DeleteIcon/>}
            />
          }
          {!hasModel && <StyledSubmitButton text="CONFIRM"/>}
        </StyledFormRow>
      </StyledForm>
    );
  }
}

export const StyledMissionForm = inject('missionFormStore', 'trackerStore')(styled(MissionForm)`
  min-width: ${props => props.theme.sidePanelWidth};
`);
