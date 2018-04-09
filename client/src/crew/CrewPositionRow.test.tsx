import * as React from 'react';
import { StyledTextInput } from '../widgets/TextInput';
import { shallow, ShallowWrapper } from 'enzyme';
import { CrewPositionRow } from './CrewPositionRow';
import { CrewModelFactory } from './factories/CrewModelFactory';
import { CrewPositionModel } from './models/CrewPositionModel';
import Mock = jest.Mock;
import { StyledCheckbox } from '../widgets/Checkbox';

describe('CrewPostionRow', () => {
  let subject: ShallowWrapper;
  let crewPosition: CrewPositionModel;
  let onChange: Mock;
  let onCheck: Mock;
  let handleDelete: Mock;
  const crew = CrewModelFactory.build();

  beforeEach(() => {
    crewPosition = crew.crewPositions[0];
    onChange = jest.fn();
    onCheck = jest.fn();
    handleDelete = jest.fn();
    subject = shallow(
      <CrewPositionRow
        crewPosition={crewPosition}
        index={0}
        onCheck={onCheck}
        onChange={onChange}
        handleDelete={handleDelete}
      />
    );
  });

  it('renders a position title input', () => {
    expect(subject.find(StyledTextInput).prop('value')).toBe(crewPosition.title);
  });

  it('should call the onChange callback when changing the title', () => {
    const event = {target: {value: 'hello', name: 'foo'}};
    subject.find(StyledTextInput).simulate('change', event);
    expect(onChange).toBeCalledWith(event);
  });

  it('should call the onCheck callback when toggling critical', () => {
    const event = {target: {value: 'hello', name: 'foo'}};
    subject.find(StyledCheckbox).simulate('change', event);
    expect(onCheck).toBeCalledWith(event);
  });

  it('should call the handleDelete callback when clicking the delete button', () => {
    const event = {target: {value: 'hello', name: 'foo'}};
    subject.find('button').simulate('click', event);
    expect(handleDelete).toBeCalledWith(event);
  });
});