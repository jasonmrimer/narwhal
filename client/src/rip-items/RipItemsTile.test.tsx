import * as React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { RipItemsTile } from './RipItemsTile';
import Mock = jest.Mock;

describe('RipItemsTile', () => {
  let subject: ShallowWrapper;
  let onClickSpy: Mock;
  onClickSpy = jest.fn();

  beforeEach(() => {
    subject = shallow(
      <RipItemsTile
        title="title"
        onClick={onClickSpy}
      />
    );
  });

  it('should give feedback for onClick', () => {
    subject.simulate('click');
    expect(onClickSpy).toBeCalled();
  });
});
