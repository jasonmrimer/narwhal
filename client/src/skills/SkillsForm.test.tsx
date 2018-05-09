import * as React from 'react';
import { mount, ReactWrapper, shallow, ShallowWrapper } from 'enzyme';
import { eventStub } from '../utils/testUtils';
import { SkillsForm, StyledSkillsForm } from './SkillsForm';
import * as moment from 'moment';
import { SkillType } from './models/SkillType';
import { StyledForm } from '../widgets/forms/Form';
import { SkillFormStore } from './stores/SkillFormStore';
import { StyledButton } from '../widgets/buttons/Button';
import { TrackerStore } from '../tracker/stores/TrackerStore';
import { DoubleRepositories } from '../utils/Repositories';
import { Provider } from 'mobx-react';
import { CurrencyStore } from '../currency/stores/CurrencyStore';
import { LocationFilterStore } from '../widgets/stores/LocationFilterStore';

/* tslint:disable:no-empty*/
describe('SkillsForm', () => {
  let subject: ShallowWrapper;
  let mountedSubject: ReactWrapper;
  let trackerStore: TrackerStore;
  let currencyStore: CurrencyStore;
  let skillActions: any;
  const earnDate = moment('2018-02-01');
  const expirationDate = moment('2019-02-01');

  beforeEach(() => {
    const store = new SkillFormStore();
    trackerStore = new TrackerStore(DoubleRepositories);

    skillActions = {
      submitSkill: jest.fn()
    };

    subject = shallow(
      <SkillsForm
        airmanId={1}
        skillFormStore={store}
        trackerStore={trackerStore}
        skillActions={skillActions}
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
    expect(skillActions.submitSkill).toHaveBeenCalled();
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

      skillActions = {
        deleteSkill: jest.fn()
      };

      mountedSubject = mount(
        <Provider
          skillFormStore={store}
          trackerStore={trackerStore}
          currencyStore={currencyStore}
          locationFilterStore={locationFilterStore}
          skillActions={skillActions}
        >
          <StyledSkillsForm airmanId={1}/>
        </Provider>
      );
    });

    it('calls executePendingDelete when clicking the delete button', () => {
      mountedSubject.find(StyledButton).simulate('click');
      expect(skillActions.deleteSkill).toHaveBeenCalled();
    });
  });
});