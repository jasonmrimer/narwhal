import { SidePanelActions } from './SidePanelActions';
import { TabType } from './stores/SidePanelStore';
import { AirmanModelFactory } from '../airman/factories/AirmanModelFactory';
import * as moment from 'moment';
import { historyMock } from '../utils/testUtils';
import { TimeServiceStub } from "./services/doubles/TimeServiceStub";

describe('SidePanelActions', () => {
  let subject: SidePanelActions;
  let clearSelectedAirmanSpy: jest.Mock;
  let closeEventFormSpy: jest.Mock;
  let closeSkillFormSpy: jest.Mock;
  let closeAirmanRipItemFormSpy: jest.Mock;
  let setSidePanelWeekSpy: jest.Mock;
  let setSelectedTabSpy: jest.Mock;
  let setSelectedAirmanSpy: jest.Mock;
  let setRipItemsForAirmanSpy: jest.Mock;
  let setAirmanEventsSpy: jest.Mock;
  let setSelectedDateSpy: jest.Mock;
  let showEventFormSpy: jest.Mock;
  let navigateToPlannerWeekSpy: jest.Mock;
  let setShowListSpy: jest.Mock;
  let refreshAirmanEventsSpy: jest.Mock;

  const week = Symbol('week');
  const airman = AirmanModelFactory.build();
  const airmanEvents = Symbol('airmanEvents');

  beforeEach(() => {
    clearSelectedAirmanSpy = jest.fn();
    closeEventFormSpy = jest.fn();
    closeSkillFormSpy = jest.fn();
    closeAirmanRipItemFormSpy = jest.fn();
    setSidePanelWeekSpy = jest.fn();
    setSelectedTabSpy = jest.fn();
    setSelectedAirmanSpy = jest.fn();
    setRipItemsForAirmanSpy = jest.fn();
    setAirmanEventsSpy = jest.fn();
    setSelectedDateSpy = jest.fn();
    showEventFormSpy = jest.fn();
    navigateToPlannerWeekSpy = jest.fn();
    setShowListSpy = jest.fn();
    refreshAirmanEventsSpy = jest.fn();

    const trackerStore = {
      clearSelectedAirman: clearSelectedAirmanSpy,
      setSelectedAirman: setSelectedAirmanSpy,
      selectedAirman: () => AirmanModelFactory.build(),
      getEventsByAirmanId: () => airmanEvents,
      performLoading: (fn: any) => {
        fn();
      },
    };

    const currencyStore = {
      closeSkillForm: closeSkillFormSpy,
      closeAirmanRipItemForm: closeAirmanRipItemFormSpy,
      setRipItemsForAirman: setRipItemsForAirmanSpy
    };

    const availabilityStore = {
      closeEventForm: closeEventFormSpy,
      setAirmanEvents: setAirmanEventsSpy,
      setSelectedDate: setSelectedDateSpy,
      showEventForm: showEventFormSpy,
      refreshAirmanEvents: refreshAirmanEventsSpy,
    };

    const plannerStore = {
      setSidePanelWeek: setSidePanelWeekSpy,
      plannerWeek: week,
      navigateToPlannerWeek: navigateToPlannerWeekSpy
    };

    const pendingEventStore = {setShowList: setShowListSpy};

    const sidePanelStore = {setSelectedTab: setSelectedTabSpy};

    subject = new SidePanelActions({
      trackerStore,
      availabilityStore,
      currencyStore,
      plannerStore,
      sidePanelStore,
      pendingEventStore,
    } as any,
    new TimeServiceStub()
    )});

  it('should close the side panel', () => {
    subject.closeSidePanel();
    expect(clearSelectedAirmanSpy).toHaveBeenCalled();
    expect(closeEventFormSpy).toHaveBeenCalled();
    expect(closeSkillFormSpy).toHaveBeenCalled();
    expect(closeAirmanRipItemFormSpy).toHaveBeenCalled();
    expect(setSidePanelWeekSpy).toHaveBeenCalledWith(week);
  });

  it('should change the side panel when a tab is selected', () => {
    subject.selectTab(TabType.CURRENCY);
    expect(closeEventFormSpy).toHaveBeenCalled();
    expect(closeSkillFormSpy).toHaveBeenCalled();
    expect(closeAirmanRipItemFormSpy).toHaveBeenCalled();
    expect(setSelectedTabSpy).toHaveBeenCalledWith(TabType.CURRENCY);
  });

  describe('open the side panel', () => {
    it('with date', async () => {

      await subject.openSidePanel(airman, TabType.CURRENCY, moment('2018-07-17T19:20:30.291Z'));

      expect(setSelectedAirmanSpy).toHaveBeenCalledWith(airman);
      expect(setSelectedTabSpy).toHaveBeenCalledWith(TabType.CURRENCY);
      expect(setSidePanelWeekSpy).toHaveBeenCalledWith(week, moment('2018-07-17T19:20:30.291Z'));

      expect(closeEventFormSpy).toHaveBeenCalled();
      expect(closeSkillFormSpy).toHaveBeenCalled();
      expect(closeAirmanRipItemFormSpy).toHaveBeenCalled();

      expect(setRipItemsForAirmanSpy).toHaveBeenCalledWith(airman.id);
      expect(setAirmanEventsSpy).toHaveBeenCalledWith(airmanEvents);
      expect(refreshAirmanEventsSpy).toHaveBeenCalled();

      expect(setSelectedDateSpy).toHaveBeenCalledWith( moment('2018-07-17T19:20:30.291Z'));
      expect(showEventFormSpy).toHaveBeenCalled();
    });

    it('with date do not show event form', async () => {

      await subject.openSidePanel(airman, TabType.CURRENCY, moment('2018-07-17T19:20:30.291Z'), true);

      expect(setSelectedAirmanSpy).toHaveBeenCalledWith(airman);
      expect(setSelectedTabSpy).toHaveBeenCalledWith(TabType.CURRENCY);
      expect(setSidePanelWeekSpy).toHaveBeenCalledWith(week, moment('2018-07-17T19:20:30.291Z'));

      expect(closeEventFormSpy).toHaveBeenCalled();
      expect(closeSkillFormSpy).toHaveBeenCalled();
      expect(closeAirmanRipItemFormSpy).toHaveBeenCalled();

      expect(setRipItemsForAirmanSpy).toHaveBeenCalledWith(airman.id);
      expect(setAirmanEventsSpy).toHaveBeenCalledWith(airmanEvents);
      expect(refreshAirmanEventsSpy).toHaveBeenCalled();

      expect(setSelectedDateSpy).toHaveBeenCalledTimes(0);
      expect(showEventFormSpy).toHaveBeenCalledTimes(0);
    });

    it('without date', async () => {
      await subject.openSidePanel(airman, TabType.CURRENCY);

      expect(setSelectedAirmanSpy).toHaveBeenCalledWith(airman);
      expect(setSelectedTabSpy).toHaveBeenCalledWith(TabType.CURRENCY);
      expect(setSidePanelWeekSpy).toHaveBeenCalledWith(week, null);

      expect(closeEventFormSpy).toHaveBeenCalled();
      expect(closeSkillFormSpy).toHaveBeenCalled();
      expect(closeAirmanRipItemFormSpy).toHaveBeenCalled();

      expect(setRipItemsForAirmanSpy).toHaveBeenCalledWith(airman.id);
      expect(setAirmanEventsSpy).toHaveBeenCalledWith(airmanEvents);
      expect(refreshAirmanEventsSpy).toHaveBeenCalled();

      expect(setSelectedDateSpy).not.toHaveBeenCalled();
      expect(showEventFormSpy).not.toHaveBeenCalled();
    });
  });

  it('should open the side panel on clicking pending event', async () => {
    const date = moment();
    await subject.openFromPendingEvent(airman, TabType.AVAILABILITY, date, historyMock);

    expect(navigateToPlannerWeekSpy).toHaveBeenCalledWith(date);
    expect(historyMock.replace).toHaveBeenCalled();
    expect(setShowListSpy).toHaveBeenCalled();
  });
});