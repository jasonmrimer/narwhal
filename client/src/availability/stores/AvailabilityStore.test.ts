import { AvailabilityStore } from './AvailabilityStore';

describe('AvailabilityStore', () => {
  describe('setShowEventForm', () => {
    it('empties the errors array', () => {
      const availabilityStore = new AvailabilityStore();
      availabilityStore.setErrors([{field: 'has error'}]);

      expect(availabilityStore.errors.length).toBe(1);

      availabilityStore.setShowEventForm(true);
      expect(availabilityStore.errors.length).toBe(0);
    });
  });
});