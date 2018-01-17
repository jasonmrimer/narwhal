import EventRepository from '../EventRepository';
import EventModel from '../../EventModel';

export default class EventRepositoryStub implements EventRepository {
  private static counter: number = 0;

  save(event: EventModel): Promise<EventModel> {
    event.id = ++EventRepositoryStub.counter;
    return Promise.resolve(event);
  }
}
