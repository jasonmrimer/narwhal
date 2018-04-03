import { EventRepository } from '../EventRepository';
import { EventModel } from '../../models/EventModel';
import { Moment } from 'moment';

export class EventRepositoryStub implements EventRepository {
  private static counter: number = 0;
  private _events: EventModel[] = [];

  save(event: EventModel): Promise<EventModel> {
    let copy = Object.assign({}, event);

    if (!event.id) {
      copy.id = ++EventRepositoryStub.counter;
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

  findAllWithinPeriod(start: Moment, end: Moment): Promise<EventModel[]> {
    return Promise.resolve(this._events.filter(event => event.startTime.isBetween(start, end)));
  }

  findAllByAirmanIdAndWithinPeriod(id: number, start: Moment, end: Moment): Promise<EventModel[]> {
    return Promise.resolve(
      this._events
        .filter(event => event.airmanId === id)
        .filter(event => event.startTime.isBetween(start, end))
    );
  }

  hasItem(event: EventModel) {
    return this._events.map(e => e.id).includes(event.id);
  }

  handleError(response: { errors: object[] }): object[] {
    return response.errors.map((error: { field: string }) => {
      return {[error.field]: 'This field is required.'};
    });
  }

  get count() {
    return this._events.length;
  }
}
