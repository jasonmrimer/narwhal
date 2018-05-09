import * as React from 'react';
import { shallow } from 'enzyme';
import { FieldValidation } from './FieldValidation';

describe('FieldValidation', () => {
  it('should display the given error message for its child input', () => {
    const subject = shallow(
      <FieldValidation fieldName="input" errors={{'input': 'there is an error'}}>
        <input/>
      </FieldValidation>
    );

    expect(subject.text()).toBe('there is an error');
    expect(subject.find('input').exists()).toBeTruthy();
  });
});