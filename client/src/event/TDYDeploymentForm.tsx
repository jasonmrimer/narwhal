import styled from 'styled-components';
import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { StyledForm, StyledFormRow } from '../widgets/forms/Form';
import { StyledTextInput } from '../widgets/inputs/TextInput';
import { StyledFieldValidation } from '../widgets/inputs/FieldValidation';
import { StyledDatePicker } from '../widgets/inputs/DatePicker';
import { StyledSubmitButton } from '../widgets/forms/SubmitButton';
import { StyledButton } from '../widgets/buttons/Button';
import { DeleteIcon } from '../icons/DeleteIcon';
import { TDYDeploymentFormStore } from './stores/TDYDeploymentFormStore';
import { EventModel } from './models/EventModel';
import { TrackerStore } from '../tracker/stores/TrackerStore';
import { EventActions } from './EventActions';
import { StyledEventCreationInfo } from '../widgets/EventCreationInfo';

interface Props {
  tdyDeploymentFormStore?: TDYDeploymentFormStore;
  trackerStore?: TrackerStore;
  eventActions?: EventActions;
  airmanId: number;
  event: EventModel | null;
  className?: string;
}

@observer
export class TDYDeploymentForm extends React.Component<Props> {
  componentDidMount() {
    this.props.tdyDeploymentFormStore!.open(this.props.event);
  }

  handleChange = ({target}: any) => {
    this.props.tdyDeploymentFormStore!.setState(target.name, target.value);
  }

  handleDelete = async () => {
    await this.props.eventActions!.handleDeleteEvent(this.props.tdyDeploymentFormStore!.model!);
  }

  handleSubmit = async (e: any) => {
    e.preventDefault();
    await this.props.eventActions!.handleFormSubmit(this.props.airmanId, this.props.tdyDeploymentFormStore!);
  }

  render() {
    const {trackerStore, tdyDeploymentFormStore} = this.props;
    const {state, errors, hasModel} = tdyDeploymentFormStore!;
    return (
      <StyledForm onSubmit={this.handleSubmit} performLoading={trackerStore!.performLoading}>
        <StyledFormRow>
          <StyledFieldValidation fieldName="title" errors={errors}>
            <StyledTextInput
              name="title"
              onChange={this.handleChange}
              placeholder="Title"
              value={state.title}
            />
          </StyledFieldValidation>
        </StyledFormRow>

        <StyledFormRow>
          <StyledTextInput
            name="description"
            onChange={this.handleChange}
            placeholder="Description"
            value={state.description}
          />
        </StyledFormRow>

        <StyledFieldValidation fieldName="validDateRange" errors={errors}>
          <StyledFieldValidation fieldName="startTime" errors={errors}>
            <StyledFormRow>
              <StyledDatePicker
                name="startTime"
                onChange={this.handleChange}
                value={state.startTime}
              />
            </StyledFormRow>
          </StyledFieldValidation>

          <StyledFieldValidation fieldName="endTime" errors={errors}>
            <StyledFormRow>
              <StyledDatePicker
                name="endTime"
                onChange={this.handleChange}
                value={state.endTime}
              />
            </StyledFormRow>
          </StyledFieldValidation>
        </StyledFieldValidation>

        {
          this.props.event ?
            this.props.event!.createdBy &&
              <StyledEventCreationInfo event={this.props.event!}/> :
            null
        }

        <StyledFormRow reversed={true}>
          <StyledSubmitButton text="CONFIRM"/>
          {
            hasModel &&
            <StyledButton
              text="DELETE"
              onClick={this.handleDelete}
              renderIcon={() => <DeleteIcon/>}
            />
          }
        </StyledFormRow>
      </StyledForm>
    );
  }
}

export const StyledTDYDeploymentForm = inject(
  'trackerStore',
  'tdyDeploymentFormStore',
  'eventActions'
)(styled(TDYDeploymentForm)`
  min-width: ${props => props.theme.sidePanelWidth};
`);