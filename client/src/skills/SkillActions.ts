import { stores } from '../stores';

export class SkillActions {
  static submitSkill = async (airmanId: number) => {
    const skill = stores.skillFormStore!.addModel(airmanId);
    try {
      await stores.currencyStore!.addSkill(skill);
      await stores.trackerStore!.refreshAirmen(stores.locationFilterStore!.selectedSite, airmanId);
      stores.skillFormStore!.close();
      stores.currencyStore!.closeSkillForm();
    } catch (e) {
      stores.skillFormStore!.setErrors(e);
    }
  }

  static deleteSkill = async () => {
    const model = stores.skillFormStore!.model;
    if (model) {
      stores.currencyStore!.removeSkill(model);
    }
  }
}