import * as React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { Filter } from './Filter';
import Mock = jest.Mock;

const expectedOptions = [
  {text: 'A-text', value: 1},
  {text: 'B-text', value: 2},
  {text: 'C-text', value: 3}
];

let subject: ShallowWrapper, callbackSpy: Mock;

describe('Filter', () => {
  beforeEach(() => {
    callbackSpy = jest.fn();
    subject = shallow(<Filter options={expectedOptions} callback={callbackSpy}/>);
  });

  it('renders a select element with the provided options', () => {
    const select = subject.find('select');
    expect(select.exists()).toBeTruthy();

    const options = select.find('option');
    expect(options.length).toBe(expectedOptions.length);

    options.forEach((option, index) => {
      expect(option.prop('value')).toBe(expectedOptions[index].value);
      expect(option.text()).toBe(expectedOptions[index].text);
    });
  });

  it('calls a callback when an option is selected', () => {
    subject.find('select').simulate('change', {target: {value: 2}});
    expect(callbackSpy).toBeCalledWith(expectedOptions[1]);
  });
});
