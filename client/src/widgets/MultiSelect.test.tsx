import * as React from 'react';
import { mount, ReactWrapper } from 'enzyme';
import { MultiSelect } from './MultiSelect';

describe('MultiSelect', () => {
  const options = [
    {value: 1, label: 'one'},
    {value: 2, label: 'two'},
    {value: 3, label: 'three'}
  ];
  const onChangeSpy = jest.fn();
  let subject: ReactWrapper;

  beforeEach(() => {
    subject = mount(
      <MultiSelect
        multiple={true}
        onChange={onChangeSpy}
        options={options}
        placeholder="Filter Tester"
        className="test-multiselect"
      />
    );
  });

  it('calls onChange', () => {
    subject.find('input').simulate('click');
    subject.find('input').simulate('keyDown', {keyCode: 40});
    subject.find('input').simulate('keyDown', {keyCode: 13});

    expect(onChangeSpy).toHaveBeenCalledWith([options[0]]);
  });

  it('renders options when you click into it', () => {
    subject.find('input').simulate('click');
    expect(subject.find('ul').exists()).toBeTruthy();
    expect(subject.find('ul li').length).toBe(3);
  });
});