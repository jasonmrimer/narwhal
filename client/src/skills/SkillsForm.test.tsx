import * as React from 'react';
import { mount, ReactWrapper, shallow, ShallowWrapper } from 'enzyme';
import { eventStub } from '../utils/testUtils';
import { SkillsForm, StyledSkillsForm } from './SkillsForm';
import * as moment from 'moment';
import { SkillType } from './models/SkillType';
import { StyledForm } from '../widgets/Form';
import { SkillFormStore } from './stores/SkillFormStore';
import { StyledButton } from '../widgets/Button';
import { TrackerStore } from '../tracker/stores/TrackerStore';
import { DoubleRepositories } from '../utils/Repositories';
import { SkillActions } from './SkillActions';
import { Provider } from 'mobx-react';
import { CurrencyStore } from '../currency/stores/CurrencyStore';
import { LocationFilterStore } from '../widgets/stores/LocationFilterStore';
import { DatePicker } from '../widgets/DatePicker';

/* tslint:disable:no-empty*/
describe('SkillsForm', () => {
  let subject: ShallowWrapper;
  let mountedSubject: ReactWrapper;
  let trackerStore: TrackerStore;
  let currencyStore: CurrencyStore;
  const earnDate = moment('2018-02-01');
  const expirationDate = moment('2019-02-01');

  beforeEach(() => {
    const store = new SkillFormStore();
    trackerStore = new TrackerStore(DoubleRepositories);
    SkillActions.submitSkill = jest.fn();
    subject = shallow(
      <SkillsForm
        airmanId={1}
        skillFormStore={store}
        trackerStore={trackerStore}
      />);
  });

  it('should render a Form', () => {
    expect(subject.find(StyledForm).prop('setLoading')).toBe(trackerStore!.setLoading);
  });

  it('calls handleSubmit with a Qualification on submission', () => {
    const skillForm = (subject.instance() as SkillsForm);
    skillForm.handleChange({target: {name: 'skillType', value: SkillType.Qualification}});
    skillForm.handleChange({target: {name: 'skillId', value: 1}});
    skillForm.handleChange({target: {name: 'earnDate', value: earnDate}});
    skillForm.handleChange({target: {name: 'expirationDate', value: expirationDate}});

    subject.find(StyledForm).simulate('submit', eventStub);
    expect(SkillActions.submitSkill).toHaveBeenCalled();
  });

  describe('rendering with an existing skill', () => {

    const skill = {
      id: 12345,
      type: SkillType.Certification,
      airmanId: 1,
      skillId: 123,
      earnDate: earnDate,
      expirationDate: expirationDate
    };

    beforeEach(() => {

      const store = new SkillFormStore();
      store.open(skill);
      currencyStore = new CurrencyStore(DoubleRepositories);
      const locationFilterStore = new LocationFilterStore();
      SkillActions.deleteSkill = jest.fn();
      mountedSubject = mount(
        <Provider
          skillFormStore={store}
          trackerStore={trackerStore}
          currencyStore={currencyStore}
          locationFilterStore={locationFilterStore}
        >
          <StyledSkillsForm airmanId={1}/>
        </Provider>
      );
    });

    it('should only allow the edit of the expiration date', () => {
      mountedSubject.find('select').forEach((elem) => {
        expect(elem.prop('disabled')).toBeTruthy();
      });

      expect(mountedSubject.find(DatePicker).at(0).prop('disabled')).toBeTruthy();
      expect(mountedSubject.find(DatePicker).at(1).prop('disabled')).toBeFalsy();

      mountedSubject.find('form').simulate('submit', eventStub);
      expect(SkillActions.submitSkill).toHaveBeenCalled();
    });

    it('calls executePendingDelete when clicking the delete button', () => {
      mountedSubject.find(StyledButton).simulate('click');
      expect(SkillActions.deleteSkill).toHaveBeenCalled();
    });
  });
});