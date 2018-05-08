import * as React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { Currency } from './Currency';
import { findSelectorWithText } from '../utils/testUtils';
import { TrackerStore } from '../tracker/stores/TrackerStore';
import { AirmanModelFactory } from '../airman/factories/AirmanModelFactory';
import { StyledSkillTile } from '../skills/SkillTile';
import { AirmanQualificationModelFactory } from '../airman/factories/AirmanQualificationModelFactory';
import { AirmanCertificationModelFactory } from '../airman/factories/AirmanCertificationModelFactory';
import { StyledNotification } from '../widgets/Notification';
import { StyledRipItems } from '../rip-item/AirmanRipItemForm';
import { CurrencyStore } from './stores/CurrencyStore';
import { DoubleRepositories } from '../utils/Repositories';

/* tslint:disable:no-empty*/
describe('Currency', () => {
  const airman = AirmanModelFactory.build(
    1,
    1,
    1,
    1,
    AirmanQualificationModelFactory.buildList(3),
    AirmanCertificationModelFactory.buildList(3, 1)
  );

  let trackerStore: TrackerStore;
  let currencyStore: CurrencyStore;
  let currencyActions: any;
  let subject: ShallowWrapper;

  beforeEach(async () => {
    currencyStore = new CurrencyStore(DoubleRepositories);

    trackerStore = new TrackerStore(DoubleRepositories);
    trackerStore.setSelectedAirman(airman);

    currencyActions = {
      addSkill: jest.fn(),
      editSkill: jest.fn()
    };

    subject = shallow(
      <Currency
        trackerStore={trackerStore}
        currencyStore={currencyStore}
        currencyActions={currencyActions}
      />
    );
  });

  it('renders the currency of an airman', () => {
    const skillsLength = airman.qualifications.length + airman.certifications.length;
    const skillTiles = subject.find(StyledSkillTile);
    const qualification = skillTiles.at(0);

    expect(skillTiles.length).toBe(skillsLength);
    expect(qualification.prop('skill')).toBe(airman.qualifications[0]);
    expect(qualification.prop('onClick')).toBeDefined();
  });

  it('renders a skill notification if the airman has no skill', () => {
    const emptyAirman = AirmanModelFactory.build();
    trackerStore.setSelectedAirman(emptyAirman);

    subject.instance().forceUpdate();
    subject.update();

    expect(subject.find(StyledNotification).exists()).toBeTruthy();
  });

  it('should show RIP items', () => {
    currencyStore.openAirmanRipItemForm();
    subject.update();

    expect(subject.find(StyledRipItems).exists()).toBeTruthy();
  });

  it('opens skill form on + Add Skill click', () => {
    findSelectorWithText(subject, 'button', '+ Add Skill').simulate('click');
    expect(currencyActions.addSkill).toHaveBeenCalled();
  });

  it('opens a Skill Form when clicking on an existing Skill Tile', () => {
    subject.find(StyledSkillTile).at(0).simulate('click');
    expect(currencyActions.editSkill).toHaveBeenCalled();
  });
});