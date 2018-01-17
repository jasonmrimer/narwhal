import EventModel from '../EventModel';

interface EventRepository {
  save(event: EventModel): Promise<EventModel>;
}

export default EventRepository;
