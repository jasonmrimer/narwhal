import EventModel from '../EventModel';

interface EventRepository {
  save(event: EventModel): Promise<EventModel>;
  delete(id: number): Promise<{status: number}>;
}

export default EventRepository;
