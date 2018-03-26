import { FormStore } from '../../widgets/stores/FormStore';
import { Skill } from '../models/Skill';
import * as moment from 'moment';
import { SkillType } from '../models/SkillType';
import { FilterOption } from '../../widgets/models/FilterOptionModel';
import { action, computed, observable } from 'mobx';
import { QualificationModel } from '../models/QualificationModel';
import { CertificationModel } from '../models/CertificationModel';
import { filterOptionsBy } from '../../utils/eventUtil';

export interface SiteIdContainer {
  selectedSite: number;
}

export interface SkillActions {
  addSkill: (skill: Skill) => void;
  removeSkill: (skill: Skill) => void;
}

interface State {
  skillType: string;
  skillId: string;
  earnDate: string;
  expirationDate: string;
}

export class SkillFormStore extends FormStore<Skill, State> {
  @observable private _certifications: CertificationModel[] = [];
  @observable private _qualifications: QualificationModel[] = [];

  constructor(private siteIdContainer: SiteIdContainer, private skillActions: SkillActions) {
    super();
    this._state = {
      skillType: '',
      skillId: '',
      earnDate: '',
      expirationDate: '',
    };
  }

  @action.bound
  hydrate(certifications: CertificationModel[], qualifications: QualificationModel[]) {
    this._certifications = certifications;
    this._qualifications = qualifications;
  }

  @action.bound
  setState(state: Partial<State>) {
    super.setState(state);

    let options: FilterOption[] = [];
    if (state.skillType === SkillType.Qualification) {
      options = this.qualificationOptions;
    } else if (state.skillType === SkillType.Certification) {
      options = this.certificationOptions;
    }

    if (state.skillId == null && options.length > 0) {
      this._state = Object.assign({}, this._state, {skillId: String(options[0].value)});
    }
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
    const options = this.qualificationOptions;
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

  @computed
  get qualificationOptions() {
    return (this._qualifications || []).map(qual => {
      return {value: qual.id, label: `${qual.acronym} - ${qual.title}`};
    });
  }

  @computed
  get certificationOptions() {
    return filterOptionsBy(this._certifications, this.siteIdContainer.selectedSite);
  }
}