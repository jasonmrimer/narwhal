import EventModel from '../EventModel';

interface EventRepository {
  save(event: EventModel): Promise<EventModel>;
  delete(event: EventModel): Promise<{status: number}>;
}

export default EventRepository;
