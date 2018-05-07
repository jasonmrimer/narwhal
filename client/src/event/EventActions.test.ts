import { EventActions } from './EventActions';
import { AirmanModel } from '../airman/models/AirmanModel';
import { AirmanModelFactory } from '../airman/factories/AirmanModelFactory';
import { TimeServiceStub } from '../tracker/services/doubles/TimeServiceStub';
import { EventModelFactory } from './factories/EventModelFactory';
import { EventModel } from './models/EventModel';
import { Moment } from 'moment';

describe('EventActions', () => {
  let subject: EventActions;
  let addEventSpy: jest.Mock;
  let navigateToWeekSpy: jest.Mock;
  let refreshEventsSpy: jest.Mock;
  let setSidePanelWeekSpy: jest.Mock;
  let setAirmanEventsSpy: jest.Mock;
  let closeEventFormSpy: jest.Mock;
  let closeSpy: jest.Mock;
  let refreshAirmanEventsSpy: jest.Mock;
  let formStore: any;
  let airman: AirmanModel;
  let event: EventModel;
  let eventWeek: Moment[];
  let plannerWeek: Symbol;
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

    plannerWeek = Symbol('plannerWeek');

    const plannerStore = {
      navigateToWeek: navigateToWeekSpy,
      setSidePanelWeek: setSidePanelWeekSpy,
      plannerWeek: plannerWeek
    };

    const availabilityStore = {
      addEvent: addEventSpy,
      refreshAirmanEvents: refreshAirmanEventsSpy,
      setAirmanEvents: setAirmanEventsSpy,
      closeEventForm: closeEventFormSpy,
      removeEvent: removeEventSpy,
      executePendingDelete: () => event,
    };

    const trackerStore = {
      refreshEvents: refreshEventsSpy,
      selectedAirman: {id: 1}
    };

    subject = new EventActions(
      {formStore, plannerStore, availabilityStore, trackerStore},
      timeService
    );
  });

  it('should call handleFormSubmit', async () => {
    await subject.handleFormSubmit(airman.id, formStore);
    expect(addEventSpy).toHaveBeenCalledWith(event);
    expect(setSidePanelWeekSpy).toHaveBeenCalledWith(eventWeek);
    expect(refreshAirmanEventsSpy).toHaveBeenCalledWith(airman.id, eventWeek);
    expect(refreshEventsSpy).toHaveBeenCalledWith(plannerWeek);
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
    expect(refreshEventsSpy).toHaveBeenCalledWith(plannerWeek);
    expect(closeEventFormSpy).toHaveBeenCalled();
  });
});