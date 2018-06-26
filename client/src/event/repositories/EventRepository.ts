import { EventApproval, EventApprovalRole, EventModel } from '../models/EventModel';
import { Moment } from 'moment';

export interface EventRepository {
  save(event: EventModel): Promise<EventModel>;
  delete(event: EventModel): Promise<void>;
  findAllBySiteIdAndWithinPeriod(siteId: number, start: Moment, end: Moment): Promise<EventModel[]>;
  findAllByAirmanIdAndWithinPeriod(airmanId: number, start: Moment, end: Moment): Promise<EventModel[]>;
  findAllPendingEventsBySiteId(siteId: number): Promise<EventModel[]>;
  hasPendingRequests(): Promise<boolean>;
  updateEventApproval(eventId: number, approval: EventApproval, role: EventApprovalRole): Promise<EventModel>;
}
