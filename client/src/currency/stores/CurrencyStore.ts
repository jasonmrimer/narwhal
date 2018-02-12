import { action, computed, observable } from 'mobx';
import { Skill } from '../../skills/models/Skill';

export default class CurrencyStore {
  @observable private _showSkillForm: boolean = false;
  @observable private _selectedSkill: Skill | null = null;

  @computed
  get showSkillForm() {
    return this._showSkillForm;
  }

  @action.bound
  setShowSkillForm(showSkillForm: boolean) {
    this._showSkillForm = showSkillForm;
  }

  @computed
  get selectedSkill() {
    return this._selectedSkill;
  }

  @action.bound
  setSelectedSkill(selectedSkill: Skill) {
    this._selectedSkill = selectedSkill;
  }

  @action.bound
  clearSelectedSkill() {
    this._selectedSkill = null;
  }
}