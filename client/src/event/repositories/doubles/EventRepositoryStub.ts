import EventRepository from '../EventRepository';
import EventModel from '../../EventModel';

export default class EventRepositoryStub implements EventRepository {
  private static counter: number = 0;
  private _events: EventModel[] = [];

  save(event: EventModel): Promise<EventModel> {
    const copy = Object.assign({}, event);
    if (!event.id) {
      copy.id = ++EventRepositoryStub.counter;
      this._events.push(copy);
    }
    return Promise.resolve(copy);
  }

  delete(event: EventModel): Promise<void> {
    delete this._events[this._events.findIndex(e => e.id === event.id)!];
    return Promise.resolve();
  }

  hasEvent(event: EventModel) {
    return this._events.map(e => e.id).includes(event.id);
  }

  get count() {
    return this._events.length;
  }
}
