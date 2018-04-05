import * as React from 'react';
import { shallow } from 'enzyme';
import { DatePicker } from './DatePicker';
import * as moment from 'moment';

describe('DatePicker', () => {
  it('should return the date as the start of the day in ISO format', () => {
    const onChangeSpy = jest.fn();
    const subject = shallow(
      <DatePicker
        name="test"
        value=""
        onChange={onChangeSpy}
      />
    );
    const instance = (subject.instance() as DatePicker);

    instance.onChange(null);
    expect(onChangeSpy).toHaveBeenCalledWith({target: {name: 'test', value: ''}});

    instance.onChange(moment.utc('2018-04-05T15:28:41.170Z'));
    expect(onChangeSpy).toHaveBeenCalledWith({target: {name: 'test', value: '2018-04-05T00:00:00.000Z'}});
  });
});