import { FormStore } from '../../widgets/stores/FormStore';
import { Skill } from '../models/Skill';
import * as moment from 'moment';
import { SkillType } from '../models/SkillType';
import { SkillActions } from './SkillActions';

interface State {
  skillType: string;
  skillId: string;
  earnDate: string;
  expirationDate: string;
}

export class SkillFormStore extends FormStore<Skill, State> {
  constructor(private skillActions: SkillActions) {
    super();
  }

  protected itemToState(item: Skill | null): State {
    if (item == null) {
      return this.emptyState();
    }
    return {
      skillType: item.type,
      skillId: String(item.skillId),
      earnDate: item.earnDate.format('YYYY-MM-DD'),
      expirationDate: item.expirationDate.format('YYYY-MM-DD'),
    };
  }

  protected emptyState(): State {
    const options = this.skillActions ? this.skillActions.qualificationOptions : [];
    return {
      skillType: SkillType.Qualification,
      skillId: options.length > 0 ? String(options[0].value) : '',
      earnDate: '',
      expirationDate: '',
    };
  }

  addItem(airmanId: number): void {
    const skill = {
      type: this._state.skillType as SkillType,
      airmanId: airmanId,
      skillId: Number(this._state.skillId),
      earnDate: moment(this._state.earnDate),
      expirationDate: moment(this._state.expirationDate),
      id: this.item ? this.item.id : null,
    };
    this.skillActions.addSkill(skill);
  }

  removeItem(): void {
    if (this.item != null) {
      this.skillActions.removeSkill(this.item);
    }
  }

  get qualificationOptions() {
    return this.skillActions.qualificationOptions;
  }

  get certificationOptions() {
    return this.skillActions.certificationOptions;
  }
}