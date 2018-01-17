import * as React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { Filter } from './Filter';
import { FilterableStore } from '../stores/FilterableStore';
import Mock = jest.Mock;

const expectedOptions = [
  {label: 'A-label', value: -1},
  {label: 'B-label', value: 2},
  {label: 'C-label', value: 3}
];

let subject: ShallowWrapper;
let callbackSpy: Mock;

class FakeFilterableStore implements FilterableStore {
  private disabled: boolean = false;

  get options() {
    return expectedOptions.slice(1);
  }

  get currentOptionId() {
    return 1;
  }

  get isDisabled() {
    return this.disabled;
  }

  setIsDisabled(value: boolean) {
    this.disabled = value;
  }
}

describe('Filter', () => {
  beforeEach(() => {
    callbackSpy = jest.fn();
    subject = shallow(
      <Filter
        id="filter"
        label="foo"
        unfilteredOption={expectedOptions[0]}
        callback={callbackSpy}
        store={new FakeFilterableStore()}
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
    const store = new FakeFilterableStore();
    store.setIsDisabled(true);

    subject = shallow(
      <Filter
        id="filter"
        label="foo"
        unfilteredOption={expectedOptions[0]}
        callback={callbackSpy}
        store={store}
      />
    );

    expect(subject.find('select').prop('disabled')).toBeTruthy();
  });
});
