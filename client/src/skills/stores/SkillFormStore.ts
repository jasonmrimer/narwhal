import { FormStore } from '../../widgets/forms/FormStore';
import { Skill } from '../models/Skill';
import * as moment from 'moment';
import { SkillType } from '../models/SkillType';
import { action, computed, observable } from 'mobx';
import { QualificationModel } from '../qualifications/models/QualificationModel';
import { CertificationModel } from '../certification/models/CertificationModel';
import { filterOptionsBy } from '../../utils/eventUtil';

interface State {
  skillType: string;
  skillId: string;
  earnDate: string;
  periodicDue: string;
  currencyExpiration: string;
  lastSat: string;
}

export class SkillFormStore extends FormStore<Skill, State> {
  @observable private _certifications: CertificationModel[] = [];
  @observable private _qualifications: QualificationModel[] = [];
  @observable private _currentSkillTypeSelection: string = SkillType.Qualification;
  @observable private _currentSkillSelection: number;
  private _siteId: number;

  constructor() {
    super();
    this._state = {
      skillType: '',
      skillId: '',
      earnDate: '',
      periodicDue: '',
      currencyExpiration: '',
      lastSat: '',
    };
  }

  @action.bound
  hydrate(certifications: CertificationModel[], qualifications: QualificationModel[], siteId: number) {
    this._certifications = certifications;
    this._qualifications = qualifications;
    this._siteId = siteId;
    this.state.skillId = this.qualificationOptions[0].value.toString();
    this._currentSkillSelection = this.qualificationOptions[0].value;
  }

  @action.bound
  setState(key: keyof State, value: string) {
    // if (key === 'skillType') {
    //   this.setDefaultSkillSelection(value);
    // } else 
      if (key === 'earnDate') {
      this.setPeriodicDue(value);
    } else if (key === 'lastSat') {
      this.setCurrencyExpiration(value);
    }
    super.setState(key, value);
  }

  @action.bound
  setCurrentSkillSelection(value: number) {
    this._currentSkillSelection = value;
  }

  @action.bound
  setCurrentSkillTypeSelection(value: string) {
    this._currentSkillTypeSelection = value;
  }

  protected modelToState(model: Skill | null): State {
    if (model == null) {
      return this.emptyState();
    }
    return {
      skillType: model.type,
      skillId: String(model.skillId),
      earnDate: model.earnDate.format('YYYY-MM-DD'),
      periodicDue: model.periodicDue.format('YYYY-MM-DD'),
      currencyExpiration: model.currencyExpiration.format('YYYY-MM-DD'),
      lastSat: model.lastSat.format('YYYY-MM-DD'),
    };
  }

  protected emptyState(): State {
    const options = this.qualificationOptions;
    return {
      skillType: SkillType.Qualification,
      skillId: options.length > 0 ? String(options[0].value) : '',
      earnDate: '',
      periodicDue: '',
      currencyExpiration: '',
      lastSat: '',
    };
  }

  stateToModel(airmanId: number) {
    return {
      type: this._state.skillType as SkillType,
      airmanId: airmanId,
      skillId: Number(this._state.skillId),
      earnDate: moment(this._state.earnDate),
      periodicDue: moment(this._state.periodicDue),
      currencyExpiration: moment(this._state.currencyExpiration),
      lastSat: moment(this._state.lastSat),
      id: this.model ? this.model.id : null,
    };
  }

  @computed
  get qualificationOptions() {
    return (this._qualifications || []).map(qual => {
      return {value: qual.id, label: `${qual.acronym} - ${qual.title}`};
    });
  }

  @computed
  get currentSkillTypeSelection() {
    return this._currentSkillTypeSelection;
  }

  @computed
  get currentSkillSelection() {
    return this._currentSkillSelection;
  }

  @computed
  get selectedSkillOption() {
    return this.skillOptions.find(x => {
      console.log(typeof x.value);
      if (x !== null && typeof x.value === 'number') {
        console.log('HALPppppppppppp')
        x.value === Number(this.state.skillId)
      }
      return false;
    });
  }

  @computed
  get skillOptions() {
    switch (this.currentSkillTypeSelection) {
      case SkillType.Certification:
        return this.certificationOptions;
      case SkillType.Qualification:
        return this.qualificationOptions;
      default:
        return [];
    }
  }

  @computed
  get certificationOptions() {
    return filterOptionsBy(this._certifications, this._siteId);
  }

  private setDefaultSkillSelection(value: string) {
    const options = (value === SkillType.Qualification) ?
      this.qualificationOptions :
      this.certificationOptions;
    if (options.length > 0) {
      super.setState('skillId', String(options[0].value));
    }
  }

  private setPeriodicDue(value: string) {
    const periodicDue = (this._state.skillType === SkillType.Qualification) ?
      moment(value).startOf('day').add(2, 'y') :
      moment(value).startOf('day').add(90, 'd');

    if (periodicDue.isValid()) {
      super.setState('periodicDue', periodicDue.format('YYYY-MM-DD'));
    }
  }

  private setCurrencyExpiration(value: string) {
    const periodicDue = moment(value).startOf('day').add(90, 'd');

    if (periodicDue.isValid()) {
      super.setState('currencyExpiration', periodicDue.format('YYYY-MM-DD'));
    }
  }
}