import EventModel from '../EventModel';

interface EventRepository {
  save(event: EventModel): Promise<EventModel>;
  delete(event: EventModel): Promise<void>;
  handleError(response: Object, event: EventModel): EventModel;
}

export default EventRepository;
