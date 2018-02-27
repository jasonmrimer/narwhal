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
import { MissionStore } from '../mission/stores/MissionStore';
import { MissionRepositoryStub } from '../mission/repositories/doubles/MissionRepositoryStub';
import { MissionModel } from '../mission/models/MissionModel';
import { StyledSubmitButton } from '../widgets/SubmitButton';
import { StyledSingleTypeahead } from '../widgets/SingleTypeahead';

describe('MissionForm', () => {
  let mission: MissionModel;
  let missionFormStore: MissionFormStore;
  let missionStore: MissionStore;
  let wrapper: ShallowWrapper;
  let subject: MissionForm;
  let eventActions: { addEvent: jest.Mock, removeEvent: jest.Mock };

  beforeEach(async () => {
    eventActions = {
      addEvent: jest.fn(),
      removeEvent: jest.fn()
    };
    missionFormStore = new MissionFormStore(eventActions);

    missionStore = new MissionStore(new MissionRepositoryStub());
    await missionStore.hydrate();
    mission = missionStore.missions[0];

    wrapper = shallow(
      <MissionForm
        airmanId={123}
        missionStore={missionStore}
        missionFormStore={missionFormStore}
      />
    );

    subject = (wrapper.instance() as MissionForm);
  });

  it('manages the state via form changes', () => {
    subject.handleChange({value: mission.missionId, label: mission.atoMissionNumber});

    expect(missionFormStore.state).toEqual({
      missionId: mission.missionId,
      startDate: mission.startDateTime.format('YYYY-MM-DD'),
      startTime: mission.startDateTime.format('HHmm'),
      endDate: mission.endDateTime!.format('YYYY-MM-DD'),
      endTime: mission.endDateTime!.format('HHmm')
    });
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
    expect(wrapper.find(StyledFieldValidation).at(0).prop('name')).toBe('title');
  });

  it('populates the fields with values from MissionFormStore', () => {
    const missionId = mission.missionId;
    mission.missionId = mission.atoMissionNumber;
    missionFormStore.setState(mission);

    wrapper.update();

    expect(wrapper.find(StyledSingleTypeahead).prop('selected')!.value).toEqual(missionId);
    expect(findInputValueByName(wrapper, StyledDatePicker, 'startDate')).toEqual(missionFormStore.state.startDate);
    expect(findInputValueByName(wrapper, StyledTimeInput, 'startTime')).toEqual(missionFormStore.state.startTime);
    expect(findInputValueByName(wrapper, StyledDatePicker, 'endDate')).toEqual(missionFormStore.state.endDate);
    expect(findInputValueByName(wrapper, StyledTimeInput, 'endTime')).toEqual(missionFormStore.state.endTime);
  });

  it('clears the state when there is no selected mission', () => {
    mission.missionId = mission.atoMissionNumber;
    missionFormStore.setState(mission);
    wrapper.update();

    subject.handleChange(null);
    wrapper.update();

    expect(wrapper.find(StyledSingleTypeahead).prop('selected')).toBeUndefined();
    expect(findInputValueByName(wrapper, StyledDatePicker, 'startDate')).toEqual('');
    expect(findInputValueByName(wrapper, StyledTimeInput, 'startTime')).toEqual('');
    expect(findInputValueByName(wrapper, StyledDatePicker, 'endDate')).toEqual('');
    expect(findInputValueByName(wrapper, StyledTimeInput, 'endTime')).toEqual('');
  });

  it('add an Mission', () => {
    subject.handleSubmit(eventStub);
    expect(eventActions.addEvent).toHaveBeenCalled();
  });

  it('remove an Mission', () => {
    missionFormStore.open(EventModelFactory.build());
    subject.handleDelete();
    expect(eventActions.removeEvent).toHaveBeenCalled();
  });
});

/* tslint:disable:no-any*/
function findInputValueByName(subject: ShallowWrapper, component: any, name: string) {
  return subject.find(component).findWhere(c => c.prop('name') === name).prop('value');
}