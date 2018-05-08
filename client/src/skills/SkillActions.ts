import { Stores } from '../stores';

export class SkillActions {
  constructor(private stores: Partial<Stores>) {
  }

  submitSkill = async (airmanId: number) => {
    const skill = this.stores.skillFormStore!.stateToModel(airmanId);
    try {
      await this.stores.currencyStore!.addSkill(skill);
      await this.stores.trackerStore!.refreshAirmen(
        this.stores.locationFilterStore!.selectedSiteId,
        airmanId
      );
      this.stores.skillFormStore!.close();
      this.stores.currencyStore!.closeSkillForm();
    } catch (e) {
      this.stores.skillFormStore!.setErrors(e);
    }
  }

  deleteSkill = () => {
    const model = this.stores.skillFormStore!.model;
    if (model) {
      this.stores.currencyStore!.removeSkill(model);
    }
  }

  executePendingDelete = async () => {
    try {
      await this.stores.currencyStore!.executePendingDelete();
      await this.stores.trackerStore!.refreshAirmen(
        this.stores.locationFilterStore!.selectedSiteId,
        this.stores.trackerStore!.selectedAirman.id
      );
      this.stores.skillFormStore!.close();
      this.stores.currencyStore!.closeSkillForm();
    } catch (e) {
      this.stores.skillFormStore!.setErrors(e);
    }
  }
}