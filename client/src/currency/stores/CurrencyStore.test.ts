import { CurrencyStore } from './CurrencyStore';

describe('CurrencyStore', () => {
  describe('setShowEventForm', () => {
    it('empties the errors array', () => {
      const currencyStore = new CurrencyStore();
      currencyStore.setErrors([{field: 'has error'}]);

      expect(currencyStore.errors.length).toBe(1);

      currencyStore.setShowSkillForm(true);
      expect(currencyStore.errors.length).toBe(0);
    });
  });
});