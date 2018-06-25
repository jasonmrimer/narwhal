import { EventRepository } from '../EventRepository';
import { EventApproval, EventApprovalRole, EventModel, EventStatus } from '../../models/EventModel';
import { Moment } from 'moment';
import { FakeAirmanRepository } from '../../../airman/repositories/doubles/FakeAirmanRepository';
import { FormErrors } from '../../../widgets/inputs/FieldValidation';
import * as moment from 'moment';
import { EventModelFactory } from '../../factories/EventModelFactory';

export class FakeEventRepository implements EventRepository {
  private static counter: number = 0;
  private _events: EventModel[] = [
    EventModelFactory.build()
  ];

  save(event: EventModel): Promise<EventModel> {
    let copy = Object.assign({}, event);

    if (!event.id) {
      copy.id = ++FakeEventRepository.counter;
      this._events.push(copy);
    }

    if (event.title.length === 0) {
      const resp = {
        errors: [
          {
            defaultMessage: 'size must be between 1 and 2147483647',
            field: 'title',
            rejectedValue: '',
            bindingFailure: false,
            code: 'Size'
          }
        ],
      };
      throw this.handleError(resp);
    }
    return Promise.resolve(copy);
  }

  delete(event: EventModel): Promise<void> {
    delete this._events[this._events.findIndex(e => e.id === event.id)!];
    return Promise.resolve();
  }

  async findAllBySiteIdAndWithinPeriod(id: number, start: Moment, end: Moment): Promise<EventModel[]> {
    const airmenIds = (await new FakeAirmanRepository().findBySiteId(id)).map(a => a.id);
    return Promise.resolve(
      this._events
        .filter(event => airmenIds.includes(event.airmanId))
        .filter(event => event.startTime.isBetween(start, end))
    );
  }

  findAllByAirmanIdAndWithinPeriod(id: number, start: Moment, end: Moment): Promise<EventModel[]> {
    return Promise.resolve(
      this._events
        .filter(event => event.airmanId === id)
        .filter(event => event.startTime.isBetween(start, end))
    );
  }

  async findAllPendingEventsBySiteId(siteId: number): Promise<EventModel[]> {
    return Promise.resolve(
      this._events
        .filter(event => event.status === EventStatus.Pending)
        .filter(event => event.startTime.isBetween(moment().startOf('day'), moment().add(60, 'days')))
    );
  }

  hasItem(event: EventModel) {
    return this._events.map(e => e.id).includes(event.id);
  }

  handleError(response: { errors: object[] }): FormErrors {
    return response.errors.reduce(
      (accum: any, val: any) => {
        accum[val.field] = 'This field is required.';
        return accum;
      },
      {}
    );
  }

  get count() {
    return this._events.length;
  }

  async hasPendingRequests(): Promise<boolean> {
    return true;
  }

  updateEventApproval(eventId: number, approval: EventApproval, role: EventApprovalRole): Promise<EventModel> {
    const event = EventModelFactory.build();
    event.id = eventId;
    if (role === EventApprovalRole.Supervisor) {
      event.supervisorApproval = approval;
      event.supervisorApprovalTime = moment();
      event.supervisorUsername = 'tytus';
    } else {
      event.schedulerApproval = approval;
      event.schedulerApprovalTime = moment();
      event.schedulerUsername = 'tytus';
    }
    return Promise.resolve(event);
  }
}
