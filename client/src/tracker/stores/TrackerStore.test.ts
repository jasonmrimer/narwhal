import { TrackerStore } from './TrackerStore';
import { AirmanModel, ShiftType } from '../../airman/models/AirmanModel';
import * as moment from 'moment';
import { toJS } from 'mobx';
import { TimeServiceStub } from '../services/doubles/TimeServiceStub';
import { DoubleRepositories } from '../../Repositories';
import { FakeAirmanRepository } from '../../airman/repositories/doubles/FakeAirmanRepository';
import { TabType } from './SidePanelStore';
import { AirmanModelFactory } from '../../airman/factories/AirmanModelFactory';

describe('TrackerStore', () => {
  const timeServiceStub = new TimeServiceStub();
  const airmanRepository = (DoubleRepositories.airmanRepository as FakeAirmanRepository);
  const siteId = 14;

  let allAirmen: AirmanModel[];
  let subject: TrackerStore;

  beforeEach(async () => {
    allAirmen = await airmanRepository.findBySiteId(siteId);
    subject = new TrackerStore(DoubleRepositories, timeServiceStub);
    await subject.hydrate(siteId);
  });

  it('returns a list of all airmen', async () => {
    expect(toJS(subject.airmen)).toEqual(allAirmen);
  });

  describe('clearing the selected airman', () => {
    it('resets the side panel week', async () => {
      expect(subject.plannerStore.sidePanelWeek[0].isSame(subject.plannerStore.plannerWeek[0])).toBeTruthy();
      await subject.plannerStore.incrementSidePanelWeek();
      expect(subject.plannerStore.sidePanelWeek[0].isSame(subject.plannerStore.plannerWeek[0])).toBeFalsy();

      subject.clearSelectedAirman();
      expect(subject.plannerStore.sidePanelWeek[0].isSame(subject.plannerStore.plannerWeek[0])).toBeTruthy();
    });
  });

  describe('setting a selectedAirman', () => {
    const airman = AirmanModelFactory.build();

    it('should set the selected airman property', async () => {
      await subject.setSelectedAirman(airman, TabType.AVAILABILITY);
      expect(subject.selectedAirman).toBe(airman);
    });

    it('should set the side panel tab', async () => {
      await subject.setSelectedAirman(airman, TabType.AVAILABILITY);
      expect(subject.sidePanelStore.selectedTab).toBe(TabType.AVAILABILITY);

      await subject.setSelectedAirman(airman, TabType.CURRENCY);
      expect(subject.sidePanelStore.selectedTab).toBe(TabType.CURRENCY);
    });

    it('should request the airman\'s rip items', async () => {
      subject.currencyStore.airmanRipItemFormStore.setRipItems = jest.fn();
      await subject.setSelectedAirman(airman, TabType.AVAILABILITY);
      expect(subject.currencyStore.airmanRipItemFormStore.setRipItems).toBeCalled();
    });

    it('should close the event and skill form when selecting a new airman', async () => {
      await subject.setSelectedAirman(airman, TabType.AVAILABILITY);
      subject.availabilityStore.closeEventForm = jest.fn();
      subject.currencyStore.closeSkillForm = jest.fn();

      await subject.setSelectedAirman(airman, TabType.AVAILABILITY);
      expect(subject.availabilityStore.closeEventForm).not.toHaveBeenCalled();
      expect(subject.currencyStore.closeSkillForm).not.toHaveBeenCalled();

      await subject.setSelectedAirman(AirmanModelFactory.build(2), TabType.AVAILABILITY);
      expect(subject.availabilityStore.closeEventForm).toHaveBeenCalled();
      expect(subject.currencyStore.closeSkillForm).toHaveBeenCalled();
    });
  });

  it('should update airman shift', async () => {
    const airman = subject.airmen[0];
    airman.shift = ShiftType.Swing;

    await subject.updateAirmanShift(airman, ShiftType.Night);
    expect(subject.airmen[0].shift).toBe(ShiftType.Night);
  });

  it('should set loading until hydrate completes', async () => {
    subject = new TrackerStore(DoubleRepositories, timeServiceStub);

    subject.setLoading(true);

    await subject.hydrate(siteId);

    expect(subject.loading).toBeFalsy();
  });

  it('should set selected Airman with a new event form for airman', () => {
    const airman = allAirmen[0];
    const date = moment.utc();
    subject.newEvent(airman, date);
    expect(subject.selectedAirman.id).toEqual(airman.id);
    expect(subject.availabilityStore.selectedDate.isSame(date)).toBeTruthy();
    expect(subject.availabilityStore.shouldShowEventForm).toBeTruthy();
    expect(subject.availabilityStore.shouldShowEventTypeSelection).toBeTruthy();
    expect(subject.sidePanelStore.selectedTab).toBe(TabType.AVAILABILITY);
  });
});
