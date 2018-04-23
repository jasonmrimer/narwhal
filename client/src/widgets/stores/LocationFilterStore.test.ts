import { UnfilteredValue } from '../models/FilterOptionModel';
import { LocationFilterStore } from './LocationFilterStore';
import { FakeAirmanRepository } from '../../airman/repositories/doubles/FakeAirmanRepository';
import { AirmanModel } from '../../airman/models/AirmanModel';
import { SiteRepositoryStub } from '../../site/repositories/doubles/SiteRepositoryStub';
import { SiteModel } from '../../site/models/SiteModel';

describe('LocationFilterStore', () => {
  const siteRepositoryStub = new SiteRepositoryStub();
  const airmanRepository: FakeAirmanRepository = new FakeAirmanRepository();
  let allAirmen: AirmanModel[];
  let sites: SiteModel[];
  let subject: LocationFilterStore;

  beforeEach(async () => {
    allAirmen = await airmanRepository.findBySiteId(14);
    subject = new LocationFilterStore();
    sites = await siteRepositoryStub.findAll();
    subject.hydrate(3, sites);
  });

  it('should not reset the flight or squadron filters when re-hydrating with the same site', () => {
    subject.setSelectedSquadron(2);
    subject.setSelectedFlight(2);
    subject.hydrate(3, sites);
    expect(subject.selectedSquadron).toBe(2);
    expect(subject.selectedFlight).toBe(2);
  });

  it('returns a list of site options', () => {
    expect(subject.siteOptions).toEqual([
      {value: 14, label: 'DMS-GA'},
      {value: 2, label: 'DMS-MD'},
      {value: 3, label: 'DMS-HI'}
    ]);
  });

  describe('filtering by site', () => {
    it('returns a list of squadron options for the site', async () => {
      await subject.setSelectedSite(14);
      expect(subject.squadronOptions).toEqual([
        {value: 1, label: 'Squad 1'},
        {value: 2, label: 'Squad 2'}
      ]);
    });

    it('resets squadron and flight when it sets a new site', async () => {
      await subject.setSelectedSite(1);
      subject.setSelectedSquadron(2);
      subject.setSelectedFlight(1);
      await subject.setSelectedSite(2);
      expect(subject.selectedSquadron).toBe(UnfilteredValue);
      expect(subject.selectedFlight).toBe(UnfilteredValue);
    });

    describe('when a site only has one squadron', () => {
      it('sets the squadron id on selection', async () => {
        await subject.setSelectedSite(3);
        expect(subject.selectedSquadron).toBe(5);
      });

      it('sets the squadron id on hydration', () => {
        expect(subject.selectedSquadron).toBe(5);
      });
    });
  });

  describe('filtering by squadron', () => {
    beforeEach(async () => {
      await subject.setSelectedSite(14);
      subject.setSelectedSquadron(1);
    });

    it('returns airmen for the site and squadron', () => {
      const filteredAirmen = subject.filterAirmen(allAirmen);
      expect(filteredAirmen.length).toBeLessThan(allAirmen.length);
      expect(filteredAirmen.map(airman => airman.flightId)
        .filter((el, i, a) => i === a.indexOf(el))).toEqual([1, 2]);
    });

    it('returns a list of flight options for the site and squadron', () => {
      expect(subject.flightOptions).toEqual([
        {value: 1, label: 'Flight 1'},
        {value: 2, label: 'Flight 2'}
      ]);
    });

    it('resets the flight when a new squadron is set', () => {
      subject.setSelectedFlight(1);
      subject.setSelectedSquadron(2);
      expect(subject.selectedFlight).toBe(UnfilteredValue);
    });
  });

  describe('filtering by flight', () => {
    beforeEach(async () => {
      await subject.setSelectedSite(1);
      subject.setSelectedSquadron(1);
      subject.setSelectedFlight(1);
    });

    it('returns airmen for the site, squadron, and flight', () => {
      const filteredAirmen = subject.filterAirmen(allAirmen);
      expect(filteredAirmen.length).toBeLessThan(allAirmen.length);
      expect(filteredAirmen.map(airman => airman.id)).toEqual([1, 2, 3]);
    });
  });
});