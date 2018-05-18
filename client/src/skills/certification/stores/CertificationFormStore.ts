import { action, computed, observable } from 'mobx';
import { NotificationStore } from '../../../widgets/stores/NotificationStore';
import { FormErrors } from '../../../widgets/inputs/FieldValidation';

interface Certification {
  title: string;
  siteId?: number;
  id?: number;
}

export class CertificationFormStore extends NotificationStore {
  @observable private _certification: Certification;
  @observable private _errors: FormErrors = {};
  @observable private _didSave: boolean = false;

  hydrate(certification: Certification) {
    this._certification = certification;
    this._errors = {};
    this._didSave = false;
  }

  @computed
  get certification() {
    return this._certification;
  }

  @computed
  get errors() {
    return this._errors;
  }

  @computed
  get didSave() {
    return this._didSave;
  }

  @action.bound
  setErrors(errors: FormErrors) {
    this._errors = errors;
  }

  @action.bound
  setDidSave(didSave: boolean) {
    this._didSave = didSave;
  }

  @action.bound
  setCertificationTitle(title: string) {
    this._certification = Object.assign({}, this._certification, {title: title.toUpperCase()});
  }
}