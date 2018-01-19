import EventRepository from './EventRepository';
import EventModel from '../EventModel';
import * as moment from 'moment';

export default function EventRepositoryContract(subject: EventRepository) {
  describe('save', () => {
    it('returns an event with a unique id', async () => {
      const dateTime = moment().subtract(1, 'year');

      const event1 = new EventModel('title1', 'description1', dateTime, dateTime, 1);
      const savedEvent1 = await subject.save(event1);
      expect(savedEvent1.id).toBeDefined();

      const event2 = new EventModel('title2', 'description2', dateTime, dateTime, 1);
      const savedEvent2 = await subject.save(event2);
      expect(savedEvent2.id).toBeDefined();

      expect(savedEvent1.id).not.toBe(savedEvent2.id);
    });
  });

  describe('delete', () => {
    it('deletes an event using its ID', async () => {
      const dateTime = moment().subtract(1, 'year');

      const event1 = new EventModel('title1', 'description1', dateTime, dateTime, 1);
      const savedEvent1 = await subject.save(event1);

      if (savedEvent1.id) {
        const resp = await subject.delete(savedEvent1.id);
        expect(resp.status).toBe(200);
      }
    });
  });
}
