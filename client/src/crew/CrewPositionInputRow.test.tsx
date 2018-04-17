import * as React from 'react';
import { StyledSingleTypeahead } from '../widgets/SingleTypeahead';
import { shallow, ShallowWrapper } from 'enzyme';
import { CrewPositionInputRow } from './CrewPositionInputRow';
import { CrewStore } from './stores/CrewStore';
import { ProfileSitePickerStore } from '../profile/stores/ProfileSitePickerStore';
import { DoubleRepositories } from '../utils/Repositories';
import { StyledCheckbox } from '../widgets/Checkbox';
import { StyledTextInput } from '../widgets/TextInput';
import { AirmanModel } from '../airman/models/AirmanModel';
import Mock = jest.Mock;

describe('CrewPositionInputRow', () => {
  let crewStore: CrewStore;
  let subject: ShallowWrapper;
  let profileStore: ProfileSitePickerStore;
  let handleNewEntryChange: Mock;
  let handleNewEntryCheck: Mock;
  let handleTypeahead: Mock;
  let airmen: AirmanModel[];

  beforeEach(async () => {
    profileStore = new ProfileSitePickerStore(DoubleRepositories);
    handleNewEntryChange = jest.fn();
    handleNewEntryCheck = jest.fn();
    handleTypeahead = jest.fn();
    airmen = await DoubleRepositories.airmanRepository.findBySiteId(14);

    await profileStore.hydrate();
    crewStore = new CrewStore(DoubleRepositories, {refreshAllEvents: jest.fn()});
    await crewStore.hydrate(await DoubleRepositories.crewRepository.findOne(1), airmen);

    subject = shallow(
      <CrewPositionInputRow
        crewStore={crewStore}
        handleNewEntryChange={handleNewEntryChange}
        handleNewEntryCheck={handleNewEntryCheck}
        handleTypeahead={handleTypeahead}
      />
    );
  });

  it('should have only airmen options in the typeahead who are not on the mission', async () => {
    crewStore.setNewEntry({airmanName: `${airmen[2].lastName}, ${airmen[2].firstName}`});
    await crewStore.save();
    subject.update();

    expect(subject.find(StyledSingleTypeahead).prop('options').length).toBe(7);
  });

  it('should handle call backs for each input type', () => {
    const event = {target: 'fake event'};

    subject.find(StyledCheckbox).simulate('change', event);
    expect(handleNewEntryCheck).toBeCalledWith(event);

    subject.find(StyledTextInput).simulate('change', event);
    expect(handleNewEntryCheck).toBeCalledWith(event);

    subject.find(StyledSingleTypeahead).simulate('change', event);
    expect(handleNewEntryCheck).toBeCalledWith(event);
  });
});