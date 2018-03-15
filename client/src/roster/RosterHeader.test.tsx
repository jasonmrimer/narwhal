import { FilterOption } from '../widgets/models/FilterOptionModel';
import { StyledMultiTypeahead } from '../widgets/MultiTypeahead';
import { findByClassName, makeFakeTrackerStore } from '../utils/testUtils';
import { shallow, ShallowWrapper } from 'enzyme';
import * as React from 'react';
import { TrackerStore } from '../tracker/stores/TrackerStore';
import { RosterHeader } from './RosterHeader';
import { QualificationModel } from '../skills/models/QualificationModel';
import { CertificationModel } from '../skills/models/CertificationModel';

describe('RosterHeader', () => {
  describe('when the list of airmen is empty', () => {
    let trackerStore: TrackerStore;
    let subject: ShallowWrapper;
    let qualifications: QualificationModel[];
    let certifications: CertificationModel[];

    beforeEach(async () => {
      trackerStore = await makeFakeTrackerStore(false);
      subject = shallow(<RosterHeader trackerStore={trackerStore}/>);
      qualifications = trackerStore.qualifications;
      certifications = trackerStore.certifications;
    });

    it('renders SHIFT, NAME, QUALIFICATION, CERTIFICATION, and Planner table headers', () => {
      const columnHeaders = ['SHIFT', 'NAME', 'QUALIFICATION', 'CERTIFICATION'];
      const componentText = subject.find('span div').map(thing => thing.text());
      componentText.forEach((header: string) => {
        expect(columnHeaders).toContain(header)
      });
    });

    describe('filter by', () => {
      describe('airmen skill', () => {
        let certificationMultiSelect: ShallowWrapper;
        let qualificationMultiSelect: ShallowWrapper;

        beforeEach(() => {
          const multiselects = subject.find(StyledMultiTypeahead);
          qualificationMultiSelect = findByClassName(multiselects, 'qualifications-multiselect');
          certificationMultiSelect = findByClassName(multiselects, 'certifications-multiselect');
        });

        it('which renders multiple qualifications', () => {
          const qualificationOptions = qualifications.map(qualification => {
            return {value: qualification.id, label: `${qualification.acronym}`};
          });

          expect(qualificationMultiSelect.prop('options')).toEqual(qualificationOptions);
        });

        it('which renders multiple certifications', () => {
          const certificationOptions = certifications.map(certification => {
            return {value: certification.id, label: certification.title};
          });
          expect(certificationMultiSelect.prop('options')).toEqual(certificationOptions);
        });
      });

      describe('airmen shift', () => {
        let shiftFilter: ShallowWrapper;

        beforeEach(() => {
          shiftFilter = subject.find('#shift-filter');
        });

        it('which renders all shifts', () => {
          expect(shiftFilter.exists()).toBeTruthy();
          expect((shiftFilter.prop('options') as Array<FilterOption>).length).toBe(3);
        });
      });
    });
  });
});