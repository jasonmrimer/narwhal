import * as React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { Currency } from './Currency';
import { findSelectorWithText } from '../utils/testUtils';
import { TrackerStore } from '../tracker/stores/TrackerStore';
import { AirmanModelFactory } from '../airman/factories/AirmanModelFactory';
import { StyledSkillsForm } from '../skills/SkillsForm';
import { StyledSkillTile } from '../skills/SkillTile';
import { AirmanQualificationModelFactory } from '../airman/factories/AirmanQualificationModelFactory';
import { AirmanCertificationModelFactory } from '../airman/factories/AirmanCertificationModelFactory';
import { StyledBackButton } from '../widgets/BackButton';
import { StyledNotification } from '../widgets/Notification';
import { StyledRipItems } from '../rip-items/AirmanRipItemForm';
import { CurrencyChild, CurrencyStore } from './stores/CurrencyStore';
import { DoubleRepositories } from '../utils/Repositories';
import { AirmanRipItemFormStore } from '../rip-items/stores/AirmanRipItemFormStore';
import { SkillFormStore } from '../skills/stores/SkillFormStore';

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
  let airmanRipItemFormStore: AirmanRipItemFormStore;
  let skillFormStore: SkillFormStore;
  let subject: ShallowWrapper;

  beforeEach(async () => {
    currencyStore = new CurrencyStore(DoubleRepositories);

    airmanRipItemFormStore = new AirmanRipItemFormStore(DoubleRepositories.ripItemRepository);

    skillFormStore = new SkillFormStore();

    trackerStore = new TrackerStore(DoubleRepositories);
    trackerStore.setSelectedAirman(airman);

    subject = shallow(
      <Currency
        trackerStore={trackerStore}
        currencyStore={currencyStore}
        airmanRipItemFormStore={airmanRipItemFormStore}
        skillFormStore={skillFormStore}
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
    expect(subject.find(StyledSkillsForm).exists()).toBeTruthy();
  });

  it('opens a Skill Form when clicking on an existing Skill Tile', () => {
    subject.find(StyledSkillTile).at(0).simulate('click');

    subject.instance().forceUpdate();
    subject.update();

    expect(skillFormStore.hasModel).toBeTruthy();
    expect(Number(skillFormStore.state.skillId)).toBe(airman.qualifications[0].skillId);
  });

  it('can exit out of a skill form', () => {
    findSelectorWithText(subject, 'button', '+ Add Skill').simulate('click');
    expect(subject.find(StyledSkillsForm).exists()).toBeTruthy();

    subject.find(StyledBackButton).simulate('click');
    expect(currencyStore.currencyChild).toBe(CurrencyChild.SkillList);
  });
});