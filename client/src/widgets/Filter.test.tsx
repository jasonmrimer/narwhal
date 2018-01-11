import * as React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { Filter } from './Filter';
import Mock = jest.Mock;

const expectedOptions = [
  {label: 'A-label', value: -1},
  {label: 'B-label', value: 2},
  {label: 'C-label', value: 3}
];

let subject: ShallowWrapper, callbackSpy: Mock;

describe('Filter', () => {
  beforeEach(() => {
    callbackSpy = jest.fn();
    subject = shallow(
      <Filter
        id="filter"
        label="foo"
        value={expectedOptions[0].value}
        unfilteredOption={expectedOptions[0]}
        options={expectedOptions.slice(1)}
        callback={callbackSpy}
      />
    );
  });

  it('renders a select element with the default option and provided options', () => {
    const select = subject.find('select');
    expect(select.exists()).toBeTruthy();

    const options = select.find('option');
    expect(options.length).toBe(expectedOptions.length);

    options.forEach((option, index) => {
      expect(option.prop('value')).toBe(expectedOptions[index].value);
      expect(option.text()).toBe(expectedOptions[index].label);
    });
  });

  it('calls a callback when a the default option is selected', () => {
    subject.find('select').simulate('change', {target: {value: expectedOptions[0].value}});
    expect(callbackSpy).toBeCalledWith(expectedOptions[0]);
  });

  it('calls a callback when an option is selected', () => {
    subject.find('select').simulate('change', {target: {value: 2}});
    expect(callbackSpy).toBeCalledWith(expectedOptions[1]);
  });

  it('disables the select if disabled is true', () => {
    subject = shallow(
      <Filter
        id="filter"
        disabled={true}
        unfilteredOption={expectedOptions[0]}
        options={[]}
        value={expectedOptions[0].value}
        callback={callbackSpy}
        label="Filter"
      />
    );

    expect(subject.find('select').prop('disabled')).toBeTruthy();
  });
});
