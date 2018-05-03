import styled from 'styled-components';
import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { StyledForm, StyledFormRow } from '../widgets/Form';
import { StyledTextInput } from '../widgets/TextInput';
import { StyledFieldValidation } from '../widgets/FieldValidation';
import { StyledDatePicker } from '../widgets/DatePicker';
import { StyledSubmitButton } from '../widgets/SubmitButton';
import { StyledButton } from '../widgets/Button';
import { DeleteIcon } from '../icons/DeleteIcon';
import { TDYDeploymentFormStore } from './stores/TDYDeploymentFormStore';
import { EventModel } from './models/EventModel';
import { TrackerStore } from '../tracker/stores/TrackerStore';
import { EventActions } from './EventActions';

interface Props {
  tdyDeploymentFormStore?: TDYDeploymentFormStore;
  trackerStore?: TrackerStore;
  airmanId: number;
  event?: EventModel;
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
    await EventActions.handleDeleteEvent(this.props.tdyDeploymentFormStore!.model!);
  }

  handleSubmit = async (e: any) => {
    e.preventDefault();
    await EventActions.handleFormSubmit(this.props.airmanId, this.props.tdyDeploymentFormStore!);
  }

  render() {
    const {trackerStore, tdyDeploymentFormStore} = this.props;
    const {state, errors, hasModel} = tdyDeploymentFormStore!;
    return (
      <StyledForm onSubmit={this.handleSubmit} setLoading={trackerStore!.setLoading}>
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

export const StyledTDYDeploymentForm = inject('trackerStore', 'tdyDeploymentFormStore')(styled(TDYDeploymentForm)`
  min-width: ${props => props.theme.sidePanelWidth};
`);