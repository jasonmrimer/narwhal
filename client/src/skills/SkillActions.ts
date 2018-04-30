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

  static deleteSkill = () => {
    const model = stores.skillFormStore!.model;
    if (model) {
      stores.currencyStore!.removeSkill(model);
    }
  }

  static executePendingDelete = async () => {
    const {currencyStore, trackerStore, locationFilterStore, skillFormStore} = stores;
    try {
      await currencyStore.executePendingDelete();
      await trackerStore.refreshAirmen(locationFilterStore.selectedSite, trackerStore.selectedAirman.id);
      skillFormStore.close();
      currencyStore.closeSkillForm();
    } catch (e) {
      skillFormStore.setErrors(e);
    }
  }
}