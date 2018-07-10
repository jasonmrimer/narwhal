import * as React from 'react';
import { StyledTextInput } from '../widgets/inputs/TextInput';
import { shallow, ShallowWrapper } from 'enzyme';
import { CrewPositionRow } from './CrewPositionRow';
import { CrewModelFactory } from './factories/CrewModelFactory';
import { CrewPositionModel } from './models/CrewPositionModel';
import { StyledCheckbox } from '../widgets/inputs/Checkbox';
import Mock = jest.Mock;

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
        airmanName={'Sequel, The'}
      />
    );
  });

  it('renders Airman name', () => {
    expect(subject.find('.airman').text()).toContain('Sequel');
  });

  it('renders a position title input', () => {
    expect(subject.find(StyledTextInput).at(0).prop('value')).toBe(crewPosition.title);
  });

  it('renders a position title input', () => {
    expect(subject.find(StyledTextInput).at(1).prop('value')).toBe(crewPosition.remarks);
  });

  it('should call the onChange callback when changing the title', () => {
    const event = {target: {value: 'hello', name: 'foo'}};
    subject.find(StyledTextInput).at(0).simulate('change', event);
    expect(onChange).toBeCalledWith(event);
  });

  it('should call the onChange callback when changing the remarks', () => {
    const event = {target: {value: 'hello', name: 'foo'}};
    subject.find(StyledTextInput).at(1).simulate('change', event);
    expect(onChange).toBeCalledWith(event);
  });

  it('should call the onCheck callback when toggling critical', () => {
    const event = {target: {value: 'hello', name: 'foo'}};
    subject.find(StyledCheckbox).simulate('change', event);
    expect(onCheck).toBeCalledWith(event);
  });

  it('should call the executePendingDelete callback when clicking the setPendingDelete button', () => {
    const event = {target: {value: 'hello', name: 'foo'}};
    subject.find('button').simulate('click', event);
    expect(handleDelete).toBeCalledWith(event);
  });
});