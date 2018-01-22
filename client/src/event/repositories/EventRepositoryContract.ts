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
    it('deletes an event without exception', async () => {
      const event = new EventModel('title1', 'description1', moment.utc(), moment.utc(), 1);
      const savedEvent = await subject.save(event);
      await subject.delete(savedEvent);
    });

    it('does not delete event with an exception', async () => {
      try {
        const event = new EventModel('title1', 'description1', moment.utc(), moment.utc(), 1, -1);
        await subject.delete(event);
      } catch (e) {
        expect(e).toBeDefined();
        return;
      }
      throw new Error('Should have failed to delete the event');
    });
  });
}
