import * as React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { Form } from './Form';

describe('Form', () => {
  let subject: ShallowWrapper;
  let onSubmit: jest.Mock;
  let performLoading: jest.Mock;

  beforeEach(() => {
    onSubmit = jest.fn();
    performLoading = jest.fn();

    subject = shallow(
      <Form
        onSubmit={onSubmit}
        performLoading={performLoading}
      >
        Hello World
      </Form>
    );
  });

  it('should call the setLoading function on submit', async () => {
    await subject.simulate('submit');
    expect(performLoading).toHaveBeenCalledTimes(1);
  });
});