import EventModel from '../EventModel';

interface EventRepository {
  save(event: EventModel): Promise<EventModel>;
  delete(event: EventModel): Promise<void>;
}

export default EventRepository;
