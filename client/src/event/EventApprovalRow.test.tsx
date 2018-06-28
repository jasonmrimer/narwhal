import * as React from 'react';
import { StyledButton } from '../widgets/buttons/Button';
import { shallow, ShallowWrapper } from 'enzyme';
import { EventApprovalRow } from './EventApprovalRow';
import { EventModelFactory } from './factories/EventModelFactory';
import * as moment from 'moment';
import { EventApproval, EventStatus, EventType } from './models/EventModel';

describe('EventApprovalRow', () => {
  let subject: ShallowWrapper;

  describe('with an event that was not acted upon', () => {
    let onClickDenySpy: jest.Mock;
    let onClickApproveSpy: jest.Mock;

    beforeEach(() => {
      onClickDenySpy = jest.fn();
      onClickApproveSpy = jest.fn();
      subject = shallow(
        <EventApprovalRow
          event={EventModelFactory.build(
            '',
            '',
            moment(),
            moment(),
            1,
            EventType.Appointment,
            null,
            EventStatus.Pending
          )}
          onClickDeny={onClickDenySpy}
          onClickApprove={onClickApproveSpy}
          eventApproval={null}
          username={'tytus'}
          approvalTime={moment('2018-09-09 1332', 'YYYY-MM-DD HHmm')}
        />
      );
    });

    it('should render a deny button when event not previously acted upon', () => {
      expect(subject.find(StyledButton).at(0).prop('text')).toBe('DENY');
      expect(subject.find(StyledButton).at(0).prop('onClick')).toBe(onClickDenySpy);
    });

    it('should render an approve button when event not previously acted upon', () => {
      expect(subject.find(StyledButton).at(1).prop('text')).toBe('APPROVE');
      expect(subject.find(StyledButton).at(1).prop('onClick')).toBe(onClickApproveSpy);
    });

  });

  describe('with an event that was acted upon', () => {
    beforeEach(() => {
      subject = shallow(
        <EventApprovalRow
          event={EventModelFactory.build(
            '',
            '',
            moment(),
            moment(),
            1,
            EventType.Appointment,
            null,
            EventStatus.Pending
          )}
          onClickDeny={() => {}}
          onClickApprove={() => {}}
          eventApproval={EventApproval.Approved}
          username={'tytus'}
          approvalTime={moment('2018-09-09 1332', 'YYYY-MM-DD HHmm')}
        />
      );
    });

    it('should render eventApproval information', () => {
      expect(subject.find('span').at(0).text()).toBe('APPROVED');
      expect(subject.find('span').at(1).text()).toBe('tytus');
      expect(subject.find('span').at(2).text()).toBe('09 SEP 18 / 1332');
    });

    it('should render an approval svg'), () => }
    
  });

});
