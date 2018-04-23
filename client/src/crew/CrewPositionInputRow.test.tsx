import * as React from 'react';
import { StyledSingleTypeahead } from '../widgets/SingleTypeahead';
import { shallow, ShallowWrapper } from 'enzyme';
import { CrewPositionInputRow, CrewStoreContract } from './CrewPositionInputRow';
import { StyledCheckbox } from '../widgets/Checkbox';
import { StyledTextInput } from '../widgets/TextInput';
import Mock = jest.Mock;

describe('CrewPositionInputRow', () => {
  let crewStore: CrewStoreContract;
  let subject: ShallowWrapper;
  let handleNewEntryChange: Mock;
  let handleNewEntryCheck: Mock;
  let handleTypeahead: Mock;

  beforeEach(async () => {
    handleNewEntryChange = jest.fn();
    handleNewEntryCheck = jest.fn();
    handleTypeahead = jest.fn();

    crewStore = {
      airmenOptions: [{label: 'airman1', value: 1}],
      newEntry: {airmanName: '', title: '', critical: false}
    };

    subject = shallow(
      <CrewPositionInputRow
        crewStore={crewStore}
        handleNewEntryChange={handleNewEntryChange}
        handleNewEntryCheck={handleNewEntryCheck}
        handleTypeahead={handleTypeahead}
      />
    );
  });

  it('should have airmen options in the typeahead', async () => {
    expect(subject.find(StyledSingleTypeahead).prop('options').length).toBe(1);
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