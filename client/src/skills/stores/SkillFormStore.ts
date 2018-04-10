import { FormStore } from '../../widgets/stores/FormStore';
import { Skill } from '../models/Skill';
import * as moment from 'moment';
import { SkillType } from '../models/SkillType';
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
  setState(key: keyof State, value: string) {
    if (key === 'skillType') {
      this.setDefaultSkillSelection(value);
    } else if (key === 'earnDate') {
      this.setExpirationDate(value);
    }
    super.setState(key, value);
  }

  protected modelToState(model: Skill | null): State {
    if (model == null) {
      return this.emptyState();
    }
    return {
      skillType: model.type,
      skillId: String(model.skillId),
      earnDate: model.earnDate.format('YYYY-MM-DD'),
      expirationDate: model.expirationDate.format('YYYY-MM-DD'),
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

  async addModel(airmanId: number) {
    const skill = {
      type: this._state.skillType as SkillType,
      airmanId: airmanId,
      skillId: Number(this._state.skillId),
      earnDate: moment(this._state.earnDate),
      expirationDate: moment(this._state.expirationDate),
      id: this.model ? this.model.id : null,
    };
    await this.skillActions.addSkill(skill);
  }

  removeModel(): void {
    if (this.model != null) {
      this.skillActions.removeSkill(this.model);
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

  private setDefaultSkillSelection(value: string) {
    const options = (value === SkillType.Qualification) ?
      this.qualificationOptions :
      this.certificationOptions;
    if (options.length > 0) {
      super.setState('skillId', String(options[0].value));
    }
  }

  private setExpirationDate(value: string) {
    const expirationDate = (this._state.skillType === SkillType.Qualification) ?
      moment(value).startOf('day').add(2, 'y') :
      moment(value).startOf('day').add(90, 'd');

    if (expirationDate.isValid()) {
      super.setState('expirationDate', expirationDate.format('YYYY-MM-DD'));
    }
  }
}