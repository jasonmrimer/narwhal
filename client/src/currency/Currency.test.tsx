import * as React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { Currency } from './Currency';
import { findSelectorWithText, makeFakeTrackerStore } from '../utils/testUtils';
import { TrackerStore } from '../tracker/stores/TrackerStore';
import { AirmanModelFactory } from '../airman/factories/AirmanModelFactory';
import { StyledSkillsForm } from '../skills/SkillsForm';
import { StyledSkillTile } from '../skills/SkillTile';
import { AirmanQualificationModelFactory } from '../airman/factories/AirmanQualificationModelFactory';
import { AirmanCertificationModelFactory } from '../airman/factories/AirmanCertificationModelFactory';
import { TabType } from '../tracker/stores/SidePanelStore';
import { StyledBackButton } from '../widgets/BackButton';
import { StyledNotification } from '../widgets/Notification';
import { StyledRipItems } from '../rip-items/AirmanRipItemForm';
import { CurrencyChild } from './stores/CurrencyStore';
import { StyledRipItemsTile } from '../rip-items/RipItemsTile';
import { AirmanRipItemModel } from '../airman/models/AirmanRipItemModel';
import { RipItemModel } from '../rip-items/models/RipItemModel';
import * as moment from 'moment';

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
  let subject: ShallowWrapper;
  beforeEach(async () => {
    trackerStore = await makeFakeTrackerStore();
    trackerStore.setSelectedAirman(airman, TabType.AVAILABILITY);
    subject = shallow(
      <Currency
        selectedAirman={trackerStore.selectedAirman}
        currencyStore={trackerStore.currencyStore}
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
    subject.setProps({selectedAirman: emptyAirman});

    expect(subject.find(StyledNotification).exists()).toBeTruthy();
  });

  it('should show RIP items', () => {
    trackerStore.currencyStore.openAirmanRipItemForm();
    subject.update();

    expect(subject.find(StyledRipItems).exists()).toBeTruthy();
  });

  it('should send a hasExpired prop to the RipItemTile', () => {
    trackerStore.currencyStore.airmanRipItemFormStore.setRipItems([
      new AirmanRipItemModel(1, 1, new RipItemModel(1, '1'), moment())
    ]);

    subject.update();
    expect(subject.find(StyledRipItemsTile).prop('hasExpiredRipItem')).toBe(true);
  });

  it('opens skill form on + Add Skill click', () => {
    findSelectorWithText(subject, 'button', '+ Add Skill').simulate('click');
    expect(subject.find(StyledSkillsForm).exists()).toBeTruthy();
  });

  it('opens a Skill Form when clicking on an existing Skill Tile', () => {
    subject.find(StyledSkillTile).at(0).simulate('click');
    subject.update();

    const store = trackerStore.currencyStore.skillFormStore;
    expect(store.hasModel).toBeTruthy();
    expect(Number(store.state.skillId)).toBe(airman.qualifications[0].skillId);
  });

  it('can exit out of a skill form', () => {
    findSelectorWithText(subject, 'button', '+ Add Skill').simulate('click');
    expect(subject.find(StyledSkillsForm).exists()).toBeTruthy();

    subject.find(StyledBackButton).simulate('click');
    expect(trackerStore.currencyStore.currencyChild).toBe(CurrencyChild.SkillList);
  });
});