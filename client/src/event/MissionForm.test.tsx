import * as React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { MissionForm } from './MissionForm';
import { MissionFormStore } from './stores/MissionFormStore';
import { eventStub } from '../utils/testUtils';
import { StyledDatePicker } from '../widgets/DatePicker';
import { StyledTimeInput } from '../widgets/TimeInput';
import { StyledFieldValidation } from '../widgets/FieldValidation';
import { StyledButton } from '../widgets/Button';
import { EventModelFactory } from './factories/EventModelFactory';
import { MissionModel } from '../mission/models/MissionModel';
import { StyledSubmitButton } from '../widgets/SubmitButton';
import { StyledSingleTypeahead } from '../widgets/SingleTypeahead';
import { StyledForm } from '../widgets/Form';
import { MissionModelFactory } from '../mission/factories/MissionModelFactory';
import { TrackerStore } from '../tracker/stores/TrackerStore';
import { DoubleRepositories } from '../utils/Repositories';

/* tslint:disable:no-empty*/
describe('MissionForm', () => {
  let mission: MissionModel;
  let missionFormStore: MissionFormStore;
  let wrapper: ShallowWrapper;
  let subject: MissionForm;
  let trackerStore: TrackerStore;
  let eventActions: any;

  beforeEach(async () => {
    trackerStore = new TrackerStore(DoubleRepositories);

    missionFormStore = new MissionFormStore();
    missionFormStore.hydrate([MissionModelFactory.build()]);
    mission = missionFormStore.missions[0];

    eventActions = {
      handleFormSubmit: jest.fn(),
      handleDeleteEvent: jest.fn(),
    };
    wrapper = shallow(
      <MissionForm
        airmanId={123}
        missionFormStore={missionFormStore}
        trackerStore={trackerStore}
        eventActions={eventActions}
      />
    );

    subject = (wrapper.instance() as MissionForm);
  });

  it('manages the state via form changes', () => {
    subject.handleChange({value: mission.id, label: mission.atoMissionNumber});

    expect(missionFormStore.state).toEqual({
      id: String(mission.id),
      title: mission.atoMissionNumber,
      startDate: mission.startDateTime.format('YYYY-MM-DD'),
      startTime: mission.startDateTime.format('HHmm'),
      endDate: mission.endDateTime!.format('YYYY-MM-DD'),
      endTime: mission.endDateTime!.format('HHmm')
    });
  });

  it('should render a Form', () => {
    expect(wrapper.find(StyledForm).prop('setLoading')).toBe(trackerStore.setLoading);
  });

  it('should render a delete button when there is an event', () => {
    missionFormStore.open(EventModelFactory.build());

    wrapper.update();

    expect(wrapper.find(StyledButton).exists()).toBeTruthy();
    expect(wrapper.find(StyledSubmitButton).exists()).toBeFalsy();
  });

  it('should NOT render a delete button when there is NOT an event', () => {
    expect(wrapper.find(StyledButton).exists()).toBeFalsy();
    expect(wrapper.find(StyledSubmitButton).exists()).toBeTruthy();
  });

  it('renders with field validation', () => {
    expect(wrapper.find(StyledFieldValidation).at(0).prop('fieldName')).toBe('title');
  });

  it('populates the fields with values from MissionFormStore', () => {
    missionFormStore.setState('id', String(mission.id));

    wrapper.update();

    expect(wrapper.find(StyledSingleTypeahead).prop('selected')!.value).toEqual(mission.id);
    expect(findInputValueByName(wrapper, StyledDatePicker, 'startDate')).toEqual(missionFormStore.state.startDate);
    expect(findInputValueByName(wrapper, StyledTimeInput, 'startTime')).toEqual(missionFormStore.state.startTime);
    expect(findInputValueByName(wrapper, StyledDatePicker, 'endDate')).toEqual(missionFormStore.state.endDate);
    expect(findInputValueByName(wrapper, StyledTimeInput, 'endTime')).toEqual(missionFormStore.state.endTime);
  });

  it('clears the state when there is no selected mission', () => {
    mission.missionId = mission.atoMissionNumber;
    missionFormStore.setState('id', '1');
    wrapper.update();

    subject.handleChange(null);
    wrapper.update();

    expect(wrapper.find(StyledSingleTypeahead).prop('selected')).toBeUndefined();
    expect(findInputValueByName(wrapper, StyledDatePicker, 'startDate')).toEqual('');
    expect(findInputValueByName(wrapper, StyledTimeInput, 'startTime')).toEqual('');
    expect(findInputValueByName(wrapper, StyledDatePicker, 'endDate')).toEqual('');
    expect(findInputValueByName(wrapper, StyledTimeInput, 'endTime')).toEqual('');
  });

  it('add a Mission', async () => {
    await subject.handleSubmit(eventStub);
    expect(eventActions.handleFormSubmit).toHaveBeenCalled();
  });

  it('remove an Mission', async () => {
    missionFormStore.open(EventModelFactory.build());
    await subject.handleDelete();
    expect(eventActions.handleDeleteEvent).toHaveBeenCalled();
  });
});

function findInputValueByName(subject: ShallowWrapper, component: any, name: string) {
  return subject.find(component).findWhere(c => c.prop('name') === name).prop('value');
}