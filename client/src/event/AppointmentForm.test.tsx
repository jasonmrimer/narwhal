import * as React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { AppointmentForm } from './AppointmentForm';
import { eventStub } from '../utils/testUtils';
import { StyledTextInput } from '../widgets/TextInput';
import { StyledDatePicker } from '../widgets/DatePicker';
import { StyledTimeInput } from '../widgets/TimeInput';
import { StyledFieldValidation } from '../widgets/FieldValidation';
import { StyledButton } from '../widgets/Button';
import { EventModelFactory } from './factories/EventModelFactory';
import { AppointmentFormStore } from './stores/AppointmentFormStore';

describe('AppointmentForm', () => {
  let store: AppointmentFormStore;
  let wrapper: ShallowWrapper;
  let subject: AppointmentForm;
  let eventActions: { addEvent: jest.Mock, removeEvent: jest.Mock };

  beforeEach(() => {
    eventActions = {
      addEvent: jest.fn(),
      removeEvent: jest.fn()
    };
    store = new AppointmentFormStore(eventActions);

    wrapper = shallow(
      <AppointmentForm
        airmanId={123}
        appointmentFormStore={store}
      />
    );

    subject = (wrapper.instance() as AppointmentForm);
  });

  it('manages the state via form changes', () => {
    subject.handleChange({target: {name: 'title', value: 'Title'}});
    subject.handleChange({target: {name: 'description', value: 'Description'}});
    subject.handleChange({target: {name: 'startDate', value: '2018-02-22'}});
    subject.handleChange({target: {name: 'startTime', value: '1200'}});
    subject.handleChange({target: {name: 'endDate', value: '2018-02-22'}});
    subject.handleChange({target: {name: 'endTime', value: '1300'}});

    expect(store.state).toEqual({
      title: 'Title',
      description: 'Description',
      startDate: '2018-02-22',
      startTime: '1200',
      endDate: '2018-02-22',
      endTime: '1300'
    });
  });

  it('should render a delete button', () => {
    store.open(EventModelFactory.build());
    wrapper.update();
    expect(wrapper.find(StyledButton).prop('onClick')).toEqual(subject.handleDelete);
  });

  it('renders with field validation', () => {
    expect(wrapper.find(StyledFieldValidation).at(0).prop('name')).toBe('title');
    expect(wrapper.find(StyledFieldValidation).at(1).prop('name')).toBe('validDateRange');
    expect(wrapper.find(StyledFieldValidation).at(2).prop('name')).toBe('startTime');
    expect(wrapper.find(StyledFieldValidation).at(3).prop('name')).toBe('endTime');
  });

  it('populates the fields with values from AppointmentFormStore', () => {
    store.setState('title', 'Title');
    store.setState('description', 'Description');
    store.setState('startDate', '2018-02-22');
    store.setState('startTime', '1200');
    store.setState('endDate', '2018-02-22');
    store.setState('endTime', '1300');

    wrapper.update();

    expect(findInputValueByName(wrapper, StyledTextInput, 'title')).toEqual(store.state.title);
    expect(findInputValueByName(wrapper, StyledTextInput, 'description')).toEqual(store.state.description);
    expect(findInputValueByName(wrapper, StyledDatePicker, 'startDate')).toEqual(store.state.startDate);
    expect(findInputValueByName(wrapper, StyledTimeInput, 'startTime')).toEqual(store.state.startTime);
    expect(findInputValueByName(wrapper, StyledDatePicker, 'endDate')).toEqual(store.state.endDate);
    expect(findInputValueByName(wrapper, StyledTimeInput, 'endTime')).toEqual(store.state.endTime);
  });

  it('add an Appointment', () => {
    subject.handleSubmit(eventStub);
    expect(eventActions.addEvent).toHaveBeenCalled();
  });

  it('remove an Appointment', () => {
    store.open(EventModelFactory.build());
    subject.handleDelete();
    expect(eventActions.removeEvent).toHaveBeenCalled();
  });
});

function findInputValueByName(subject: ShallowWrapper, component: any, name: string) {
  return subject.find(component).findWhere(c => c.prop('name') === name).prop('value');
}