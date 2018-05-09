import * as React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { Form } from './Form';

describe('Form', () => {
  let subject: ShallowWrapper;
  let onSubmit: jest.Mock;
  let setLoading: jest.Mock;

  beforeEach(() => {
    onSubmit = jest.fn();
    setLoading = jest.fn();

    subject = shallow(
      <Form
        onSubmit={onSubmit}
        setLoading={setLoading}
      >
        Hello World
      </Form>
    );
  });

  it('should call the setLoading function on submit', async () => {
    await subject.simulate('submit');
    expect(setLoading).toHaveBeenCalledTimes(2);
  });
});