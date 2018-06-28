import { EventActions } from './EventActions';
import { AirmanModel } from '../airman/models/AirmanModel';
import { AirmanModelFactory } from '../airman/factories/AirmanModelFactory';
import { TimeServiceStub } from '../tracker/services/doubles/TimeServiceStub';
import { EventModelFactory } from './factories/EventModelFactory';
import {EventApproval, EventApprovalRole, EventModel} from './models/EventModel';
import { Moment } from 'moment';

describe('EventActions', () => {
  let subject: EventActions;
  let addEventSpy: jest.Mock;
  let navigateToWeekSpy: jest.Mock;
  let refreshEventsSpy: jest.Mock;
  let setSidePanelWeekSpy: jest.Mock;
  let setAirmanEventsSpy: jest.Mock;
  let closeEventFormSpy: jest.Mock;
  let updateEventApprovalSpy: jest.Mock;
  let closeSpy: jest.Mock;
  let refreshAirmanEventsSpy: jest.Mock;
  let formStore: any;
  let airman: AirmanModel;
  let event: EventModel;
  let eventWeek: Moment[];
  let plannerTimeSpan: Symbol;
  let removeEventSpy: jest.Mock;

  beforeEach(() => {
    airman = AirmanModelFactory.build();
    addEventSpy = jest.fn();
    navigateToWeekSpy = jest.fn();
    refreshEventsSpy = jest.fn();
    refreshAirmanEventsSpy = jest.fn();
    setSidePanelWeekSpy = jest.fn();
    setAirmanEventsSpy = jest.fn();
    closeEventFormSpy = jest.fn();
    updateEventApprovalSpy = jest.fn();
    event = EventModelFactory.build();
    const timeService = new TimeServiceStub();
    eventWeek = timeService.navigateToWeek(event.startTime);
    closeSpy = jest.fn();
    removeEventSpy = jest.fn();

    formStore = {
      stateToModel: (id: number) => {
        return event;
      },
      close: closeSpy
    };

    plannerTimeSpan = Symbol('plannerTimeSpan');

    const plannerStore = {
      navigateToWeek: navigateToWeekSpy,
      setSidePanelWeek: setSidePanelWeekSpy,
      plannerTimeSpan: plannerTimeSpan
    };

    const availabilityStore = {
      addEvent: addEventSpy,
      refreshAirmanEvents: refreshAirmanEventsSpy,
      setAirmanEvents: setAirmanEventsSpy,
      closeEventForm: closeEventFormSpy,
      updateEventApproval: updateEventApprovalSpy,
      removeEvent: removeEventSpy,
      executePendingDelete: () => event,
    };

    const trackerStore = {
      refreshEvents: refreshEventsSpy,
      selectedAirman: {id: 1}
    };

    subject = new EventActions(
      {plannerStore, availabilityStore, trackerStore} as any,
      timeService
    );
  });

  it('should call handleFormSubmit', async () => {
    await subject.handleFormSubmit(airman.id, formStore);
    expect(addEventSpy).toHaveBeenCalledWith(event);
    expect(setSidePanelWeekSpy).toHaveBeenCalledWith(eventWeek);
    expect(refreshAirmanEventsSpy).toHaveBeenCalledWith(airman.id, eventWeek);
    expect(refreshEventsSpy).toHaveBeenCalledWith(plannerTimeSpan);
    expect(closeEventFormSpy).toHaveBeenCalled();
    expect(closeSpy).toHaveBeenCalled();
  });

  it('should call handleDeleteEvent', () => {
    subject.handleDeleteEvent(event);
    expect(removeEventSpy).toHaveBeenCalledWith(event);
  });

  it('should call executePendingDelete', async () => {
    await subject.executePendingDelete();
    expect(refreshAirmanEventsSpy).toHaveBeenCalledWith(airman.id, eventWeek);
    expect(refreshEventsSpy).toHaveBeenCalledWith(plannerTimeSpan);
    expect(closeEventFormSpy).toHaveBeenCalled();
  });

  it('should call updateEventStatusAction', async () => {
    await subject.updateEventApproval(EventApproval.Approved, EventApprovalRole.Supervisor);
    expect(updateEventApprovalSpy).toHaveBeenCalledWith(EventApproval.Approved, EventApprovalRole.Supervisor);
  });
});