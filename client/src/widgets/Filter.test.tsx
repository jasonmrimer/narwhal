import * as React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { Filter } from './Filter';
import { UnfilteredValue } from './models/FilterOptionModel';
import { StyledFilterNotification } from './FilterNotification';
import Mock = jest.Mock;

const expectedOptions = [
  {label: 'A-label', value: UnfilteredValue},
  {label: 'B-label', value: 2},
  {label: 'C-label', value: 3}
];

let subject: ShallowWrapper;
let callbackSpy: Mock;

describe('Filter', () => {
  beforeEach(() => {
    callbackSpy = jest.fn();
    subject = shallow(
      <Filter
        id="filter"
        label="foo"
        options={expectedOptions.slice(1)}
        value={expectedOptions[0].value}
        unfilteredOptionLabel={expectedOptions[0].label}
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
    expect(callbackSpy).toBeCalledWith(expectedOptions[0].value);
  });

  it('calls a callback when an option is selected', () => {
    subject.find('select').simulate('change', {target: {value: 2}});
    expect(callbackSpy).toBeCalledWith(expectedOptions[1].value);
  });

  it('disables the select if disabled is true', () => {
    subject = shallow(
      <Filter
        id="filter"
        label="foo"
        options={[]}
        value={UnfilteredValue}
        unfilteredOptionLabel="Unfiltered"
        callback={callbackSpy}
      />
    );

    expect(subject.find('select').prop('disabled')).toBeTruthy();
  });

  it('renders a StyledFilterNotifcation if a disabled filter is clicked', () => {
    subject = shallow(
      <Filter
        id="filter"
        label="foo"
        options={[]}
        value={UnfilteredValue}
        unfilteredOptionLabel="Unfiltered"
        callback={callbackSpy}
      />
    );

    subject.simulate('click');
    expect(subject.state('showNotification')).toBeTruthy();
    expect(subject.find(StyledFilterNotification).exists()).toBeTruthy();
  });
});
