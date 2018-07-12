import { FilterOption } from '../widgets/inputs/FilterOptionModel';
import { StyledMultiTypeahead } from '../widgets/inputs/MultiTypeahead';
import { findByClassName } from '../utils/testUtils';
import { shallow, ShallowWrapper } from 'enzyme';
import * as React from 'react';
import { RosterHeader, RosterHeaderStoreContract } from './RosterHeader';

describe('RosterHeader', () => {
  describe('when the list of airmen is empty', () => {
    let subject: ShallowWrapper;
    let rosterHeaderStore: RosterHeaderStoreContract;

    beforeEach(async () => {
      rosterHeaderStore = {
        selectedShift: {label: 'All', value: -1},
        setSelectedShift: jest.fn(),
        shiftOptions: [{label: 'days', value: 0}],
        selectedLastName: '',
        setSelectedLastName: jest.fn(),
        selectedQualificationOptions: [],
        setSelectedQualificationOptions: jest.fn(),
        qualificationOptions: [{label: 'qual 1', value: 0}],
        selectedCertificationOptions: [],
        setSelectedCertificationOptions: jest.fn(),
        certificationOptions: [{label: 'cert 1', value: 0}],
      };

      subject = shallow(<RosterHeader rosterHeaderStore={rosterHeaderStore}/>);
    });

    it('renders SHIFT, NAME, QUALIFICATION, CERTIFICATION, and Planner table headers', () => {
      const columnHeaders = ['SHIFT', 'NAME', 'QUALIFICATION', 'CERTIFICATION'];
      const componentText = subject.find('span div').map(thing => thing.text());
      componentText.forEach((header: string) => {
        expect(columnHeaders).toContain(header);
      });
    });

    describe('filter by', () => {
      describe('airmen skill', () => {
        let certificationMultiTypeahead: ShallowWrapper;
        let qualificationMultiTypeahead: ShallowWrapper;

        beforeEach(() => {
          const multiTypeaheads = subject.find(StyledMultiTypeahead);
          qualificationMultiTypeahead = findByClassName(multiTypeaheads, 'qualifications-multitypeahead');
          certificationMultiTypeahead = findByClassName(multiTypeaheads, 'certifications-multitypeahead');
        });

        it('which renders multiple qualifications', () => {
          expect(qualificationMultiTypeahead.prop('options')).toEqual([{label: 'qual 1', value: 0}]);
        });

        it('which renders multiple certifications', () => {
          expect(certificationMultiTypeahead.prop('options')).toEqual([{label: 'cert 1', value: 0}]);
        });
      });

      describe('airmen shift', () => {
        let shiftFilter: ShallowWrapper;

        beforeEach(() => {
          shiftFilter = subject.find('.shift-filter');
        });

        it('which renders all shifts', () => {
          expect(shiftFilter.exists()).toBeTruthy();
          expect((shiftFilter.prop('options') as Array<FilterOption>).length).toBe(1);
        });
      });
    });
  });
});