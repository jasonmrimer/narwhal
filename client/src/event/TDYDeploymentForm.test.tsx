import * as React from 'react';
import { TDYDeploymentFormStore } from './stores/TDYDeploymentFormStore';
import { StyledButton } from '../widgets/Button';
import { StyledDatePicker } from '../widgets/DatePicker';
import { EventModelFactory } from './factories/EventModelFactory';
import { shallow, ShallowWrapper } from 'enzyme';
import { StyledTextInput } from '../widgets/TextInput';
import { eventStub } from '../utils/testUtils';
import { TDYDeploymentForm } from './TDYDeploymentForm';
import { StyledForm } from '../widgets/Form';

/* tslint:disable:no-empty*/
describe('TDYDeploymentForm', () => {
  let store: TDYDeploymentFormStore;
  let wrapper: ShallowWrapper;
  let subject: TDYDeploymentForm;
  let eventActions: { addEvent: jest.Mock, removeEvent: jest.Mock };
  let setLoading = () => {};

  beforeEach(() => {
    eventActions = {
      addEvent: jest.fn(),
      removeEvent: jest.fn()
    };
    store = new TDYDeploymentFormStore(eventActions);

    wrapper = shallow(
      <TDYDeploymentForm
        airmanId={123}
        tdyDeploymentFormStore={store}
        setLoading={setLoading}
      />
    );

    subject = (wrapper.instance() as TDYDeploymentForm);
  });

  it('should render a Form', () => {
    expect(wrapper.find(StyledForm).prop('setLoading')).toBe(setLoading);
  });

  it('manages the state via form changes', () => {
    subject.handleChange({target: {name: 'title', value: 'Title'}});
    subject.handleChange({target: {name: 'description', value: 'Description'}});
    subject.handleChange({target: {name: 'startTime', value: '2018-02-22'}});
    subject.handleChange({target: {name: 'endTime', value: '2018-02-22'}});

    expect(store.state).toEqual({
      title: 'Title',
      description: 'Description',
      startTime: '2018-02-22',
      endTime: '2018-02-22',
    });
  });

  it('should render a delete button', () => {
    store.open(EventModelFactory.build());
    wrapper.update();
    expect(wrapper.find(StyledButton).prop('onClick')).toEqual(subject.handleDelete);
  });

  it('populates the fields with values from TDYDeploymentFormStore', () => {
    store.setState('title', 'Title');
    store.setState('description', 'Description');
    store.setState('startTime', '2018-02-22');
    store.setState('endTime', '2018-02-22');

    wrapper.update();

    expect(findInputValueByName(wrapper, StyledTextInput, 'title')).toEqual(store.state.title);
    expect(findInputValueByName(wrapper, StyledTextInput, 'description')).toEqual(store.state.description);
    expect(findInputValueByName(wrapper, StyledDatePicker, 'startTime')).toEqual(store.state.startTime);
    expect(findInputValueByName(wrapper, StyledDatePicker, 'endTime')).toEqual(store.state.endTime);
  });

  it('adds a TDY/Deployment', () => {
    subject.handleSubmit(eventStub);
    expect(eventActions.addEvent).toHaveBeenCalled();
  });

  it('removes a TDY/Deployment', () => {
    store.open(EventModelFactory.build());
    subject.handleDelete();
    expect(eventActions.removeEvent).toHaveBeenCalled();
  });
});

function findInputValueByName(subject: ShallowWrapper, component: any, name: string) {
  return subject.find(component).findWhere(c => c.prop('name') === name).prop('value');
}