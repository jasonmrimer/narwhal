import { stores } from '../stores';
import { Skill } from '../skills/models/Skill';

export class CurrencyActions {
  static addSkill = () => {
    stores.currencyStore.openCreateSkillForm();
    stores.skillFormStore.open();
  }

  static addRipItems = () => {
    stores.airmanRipItemFormStore.setRipItems(stores.currencyStore.airmanRipItems);
    stores.currencyStore.openAirmanRipItemForm();
  }

  static editSkill = (skill: Skill) => {
    stores.currencyStore.openEditSkillForm();
    stores.skillFormStore.open(skill);
  }
}