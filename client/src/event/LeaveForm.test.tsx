import * as React from 'react';
import * as moment from 'moment';
import { mount, shallow, ShallowWrapper } from 'enzyme';
import { LeaveForm } from './LeaveForm';
import { LeaveFormStore } from './stores/LeaveFormStore';
import { eventStub, makeFakeProfile } from '../utils/testUtils';
import { StyledTextInput } from '../widgets/inputs/TextInput';
import { StyledDatePicker } from '../widgets/inputs/DatePicker';
import { StyledTimeInput } from '../widgets/inputs/TimeInput';
import { StyledFieldValidation } from '../widgets/inputs/FieldValidation';
import { StyledButton } from '../widgets/buttons/Button';
import { EventModelFactory } from './factories/EventModelFactory';
import { TimeServiceStub } from '../tracker/services/doubles/TimeServiceStub';
import { TrackerStore } from '../tracker/stores/TrackerStore';
import { DoubleRepositories } from '../utils/Repositories';
import { StyledEventCreationInfo } from '../widgets/EventCreationInfo';
import { ProfileSitePickerStore } from '../profile/stores/ProfileSitePickerStore';
import { readerAbility } from '../app/abilities';
import { StyledSubmitButton } from '../widgets/forms/SubmitButton';
import { StyledEventApprovalRow } from './EventApprovalRow';
import { EventModel, EventStatus, EventType } from './models/EventModel';

/* tslint:disable:no-empty*/
describe('LeaveForm', () => {
  let store: LeaveFormStore;
  let profileStore: ProfileSitePickerStore;
  let wrapper: ShallowWrapper;
  let subject: LeaveForm;
  let trackerStore: TrackerStore;
  let eventActions: any;

  beforeEach(async () => {
    eventActions = {
      handleFormSubmit: jest.fn(),
      handleDeleteEvent: jest.fn(),
    };
    store = new LeaveFormStore(new TimeServiceStub());
    profileStore = new ProfileSitePickerStore(DoubleRepositories);
    await profileStore.hydrate(
      [],
      makeFakeProfile('READER', readerAbility)
    );

    trackerStore = new TrackerStore(DoubleRepositories);
    wrapper = shallow(
      <LeaveForm
        airmanId={123}
        leaveFormStore={store}
        trackerStore={trackerStore}
        profileStore={profileStore}
        eventActions={eventActions}
        event={null}
      />
    );

    subject = (wrapper.instance() as LeaveForm);
  });

  it('manages the state via form changes', () => {
    subject.handleChange({target: {name: 'description', value: 'Description'}});
    subject.handleChange({target: {name: 'startDate', value: '2018-02-22'}});
    subject.handleChange({target: {name: 'startTime', value: '1200'}});
    subject.handleChange({target: {name: 'endDate', value: '2018-02-22'}});
    subject.handleChange({target: {name: 'endTime', value: '1300'}});

    expect(store.state).toEqual({
      description: 'Description',
      startDate: '2018-02-22',
      startTime: '1200',
      endDate: '2018-02-22',
      endTime: '1300'
    });
  });

  it('should render a setPendingDelete button', () => {
    store.open(EventModelFactory.build());
    wrapper.update();
    expect(wrapper.find(StyledButton).prop('onClick')).toEqual(subject.handleDelete);
  });

  it('renders with field validation', () => {
    expect(wrapper.find(StyledFieldValidation).at(0).prop('fieldName')).toBe('validDateRange');
    expect(wrapper.find(StyledFieldValidation).at(1).prop('fieldName')).toBe('startTime');
    expect(wrapper.find(StyledFieldValidation).at(2).prop('fieldName')).toBe('endTime');
  });

  it('populates the fields with values from LeaveFormStore', () => {
    store.setState('description', 'Description');
    store.setState('startDate', '2018-02-22');
    store.setState('startTime', '1200');
    store.setState('endDate', '2018-02-22');
    store.setState('endTime', '1300');

    wrapper.update();

    expect(findInputValueByName(wrapper, StyledTextInput, 'description')).toEqual(store.state.description);
    expect(findInputValueByName(wrapper, StyledDatePicker, 'startDate')).toEqual(store.state.startDate);
    expect(findInputValueByName(wrapper, StyledTimeInput, 'startTime')).toEqual(store.state.startTime);
    expect(findInputValueByName(wrapper, StyledDatePicker, 'endDate')).toEqual(store.state.endDate);
    expect(findInputValueByName(wrapper, StyledTimeInput, 'endTime')).toEqual(store.state.endTime);
  });

  it('adds a Leave', async () => {
    await subject.handleSubmit(eventStub);
    expect(eventActions.handleFormSubmit).toHaveBeenCalled();
  });

  it('removes a Leave', async () => {
    store.open(EventModelFactory.build());
    await subject.handleDelete();
    expect(eventActions.handleDeleteEvent).toHaveBeenCalled();
  });

  it('should render the creation data for an existing event', () => {
    const event = EventModelFactory.build();
    event.createdOn = moment();
    event.createdBy = 'user';

    const mountedWrapper = mount(
      <LeaveForm
        airmanId={123}
        leaveFormStore={store}
        trackerStore={trackerStore}
        profileStore={profileStore}
        eventActions={eventActions}
        event={event}
      />
    );

    expect(mountedWrapper.find(StyledEventCreationInfo).exists()).toBeTruthy();
  });

  it('should render a submit request button', () => {
    expect(wrapper.find(StyledSubmitButton).prop('text')).toBe('SUBMIT REQUEST');
  });

  describe('eventApproval process', () => {
    let pendingEvent: EventModel;
    beforeEach(() => {
      pendingEvent = EventModelFactory.build();
      pendingEvent.type = EventType.Leave;
      pendingEvent.status = EventStatus.Pending;

      wrapper = shallow(
        <LeaveForm
          airmanId={123}
          leaveFormStore={store}
          trackerStore={trackerStore}
          profileStore={profileStore}
          eventActions={eventActions}
          event={pendingEvent}
        />
      );
    });

    it('should render StyledEventApprovalRows if it is a pending/approved event', () => {
      expect(wrapper.find(StyledEventApprovalRow).length).toBe(2);
    });

    it('should not render StyledEventApprovalRows if it is an auto approved event', () => {
      pendingEvent.status = EventStatus.AutoApproved;

      wrapper = shallow(
        <LeaveForm
          airmanId={123}
          leaveFormStore={store}
          trackerStore={trackerStore}
          profileStore={profileStore}
          eventActions={eventActions}
          event={pendingEvent}
        />
      );

      expect(wrapper.find(StyledEventApprovalRow).length).toBe(0);
    });
  });
});

function findInputValueByName(subject: ShallowWrapper, component: any, name: string) {
  return subject.find(component).findWhere(c => c.prop('name') === name).prop('value');
}