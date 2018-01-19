import EventRepository from '../EventRepository';
import EventModel from '../../EventModel';

export default class EventRepositoryStub implements EventRepository {
  private static counter: number = 0;
  private _deletedEvents: number[] = [];

  save(event: EventModel): Promise<EventModel> {
    event.id = ++EventRepositoryStub.counter;
    return Promise.resolve(event);
  }

  delete(event: EventModel): Promise<{ status: number }> {
    this._deletedEvents.push(event.id!);
    return Promise.resolve({status: 200});
  }

  get deletedEvents() {
    return this._deletedEvents;
  }
}
