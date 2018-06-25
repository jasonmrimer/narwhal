import * as React from 'react';
import { StyledButton } from '../widgets/buttons/Button';
import { shallow, ShallowWrapper } from 'enzyme';
import { EventApprovalRow } from './EventApprovalRow';
import { EventModelFactory } from './factories/EventModelFactory';
import * as moment from 'moment';
import { EventApproval, EventApprovalRole, EventStatus, EventType } from './models/EventModel';
import { ApprovedIcon } from '../icons/ApprovedIcon';

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
          role={EventApprovalRole.Supervisor}
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
      let event = EventModelFactory.build(
        '',
        '',
        moment(),
        moment(),
        1,
        EventType.Appointment,
        null,
        EventStatus.Pending
      );
      event.supervisorUsername = 'tytus';
      event.supervisorApproval = EventApproval.Approved;
      event.supervisorApprovalTime = moment('2018-09-09 1332', 'YYYY-MM-DD HHmm');

      subject = shallow(
        <EventApprovalRow
          event={event}
          onClickDeny={() => {}}
          onClickApprove={() => {}}
          role={EventApprovalRole.Supervisor}
        />
      );
    });

    it('should render eventApproval information', () => {
      expect(subject.find('.approval-decision').text()).toBe('approved');
      expect(subject.find('.event-approval-decisions').text()).toContain('tytus');
      expect(subject.find('.event-approval-decisions').text()).toContain('09 SEP 18 / 1332');
    });

    it('should render an approval svg', () => {
      expect(subject.find(ApprovedIcon).exists()).toBeTruthy();
    });

    it('should render which role is being displayed', () => {
      expect(subject.find('.approval-role').text()).toBe('supervisor approval');
    });
  });
});
