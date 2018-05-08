import { Stores } from '../stores';
import { Skill } from '../skills/models/Skill';

export class CurrencyActions {
  constructor(private stores: Partial<Stores>) {
  }

  addSkill = () => {
    this.stores.currencyStore!.openCreateSkillForm();
    this.stores.skillFormStore!.open();
  }

  addRipItems = () => {
    this.stores.airmanRipItemFormStore!.setRipItems(this.stores.currencyStore!.airmanRipItems);
    this.stores.currencyStore!.openAirmanRipItemForm();
  }

  editSkill = (skill: Skill) => {
    this.stores.currencyStore!.openEditSkillForm();
    this.stores.skillFormStore!.open(skill);
  }
}