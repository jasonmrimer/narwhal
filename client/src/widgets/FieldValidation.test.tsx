import * as React from 'react';
import { shallow } from 'enzyme';
import { FieldValidation } from './FieldValidation';

describe('FieldValidation', () => {
  it('should display an error message for the child field', () => {
    const subject = shallow(
      <FieldValidation name="fieldName" errors={[{fieldName: 'hello'}]}>
        <input />
      </FieldValidation>
    );

    expect(subject.text()).toBe('This field is required.');
    expect(subject.find('input').exists()).toBeTruthy();
  });
});