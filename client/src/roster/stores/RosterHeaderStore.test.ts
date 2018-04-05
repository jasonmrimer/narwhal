import { RosterHeaderStore } from './RosterHeaderStore';
import { CertificationModelFactory } from '../../skills/factories/CertificationModelFactory';
import { QualificationModelFactory } from '../../skills/factories/QualificationModelFactory';
import { AirmanModel, ShiftType } from '../../airman/models/AirmanModel';
import { FakeAirmanRepository } from '../../airman/repositories/doubles/FakeAirmanRepository';

describe('RosterHeaderStore', () => {
  const airmanRepository: FakeAirmanRepository = new FakeAirmanRepository();
  let allAirmen: AirmanModel[];
  let subject: RosterHeaderStore;

  beforeEach(async () => {
    allAirmen = await airmanRepository.findBySiteId(14);
    subject = new RosterHeaderStore({selectedSite: 1});
    subject.hydrate(CertificationModelFactory.buildList(3, 1), QualificationModelFactory.buildList(3));
  });

  it('returns a list of qualification options', () => {
    expect(subject.qualificationOptions).toEqual([
      {value: 0, label: '0'},
      {value: 1, label: '1'},
      {value: 2, label: '2'}
    ]);
  });

  it('returns a list of certification options based on the selected site', () => {
    expect(subject.certificationOptions).toEqual([
      {value: 0, label: '0'},
      {value: 1, label: '1'},
      {value: 2, label: '2'}
    ]);
  });

  describe('filtering by certifications', () => {
    beforeEach(() => {
      subject.setSelectedCertificationOptions([
        {value: 4, label: 'Certification 4'},
        {value: 5, label: 'Certification 5'}
      ]);
    });

    it('returns airmen with the selected certifications', () => {
      const filteredAirmen = subject.filterAirmen(allAirmen);
      expect(filteredAirmen.length).toBeLessThan(allAirmen.length);
      expect(filteredAirmen.map(airman => airman.id)).toEqual([4, 10]);
    });
  });

  describe('filtering by qualifications', () => {
    beforeEach(() => {
      subject.setSelectedQualificationOptions([
        {value: 1, label: 'qualification 1'},
        {value: 2, label: 'qualification 2'}
      ]);
    });

    it('returns airmen with the selected qualifications', () => {
      const filteredAirmen = subject.filterAirmen(allAirmen);
      expect(filteredAirmen.length).toBeLessThan(allAirmen.length);
      expect(filteredAirmen.map(airman => airman.id)).toEqual([4, 10]);
    });
  });

  describe('filtering by shift', () => {
    it('should return the airmen with the selected shift', () => {
      subject.setSelectedShift(2);
      const shift = subject.filterAirmen(allAirmen)
        .map(amn => amn.shift)
        .filter((el, i, a) => i === a.indexOf(el));
      expect(shift.length).toBe(1);
      expect(shift[0]).toBe(ShiftType.Night);
    });
  });

  it('should set the selectedLastName', () => {
    const airman = allAirmen[0];
    subject.setSelectedLastName({target: {value: airman.lastName}});

    expect(subject.filterAirmen(allAirmen).length).toBe(1);
    expect(subject.filterAirmen(allAirmen)[0].firstName).toBe(airman.firstName);
  });
});