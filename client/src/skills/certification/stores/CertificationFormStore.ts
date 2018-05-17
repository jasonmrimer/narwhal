import { action, computed, observable } from 'mobx';
import { CertificationModel } from '../models/CertificationModel';
import { Repositories } from '../../../utils/Repositories';
import { NotificationStore } from '../../../widgets/stores/NotificationStore';
import { CertificationRepository } from '../repositories/CertificationRepository';
import { FormErrors } from '../../../widgets/inputs/FieldValidation';

export class CertificationFormStore extends NotificationStore {
  private certificationRepository: CertificationRepository;

  @observable private _certification: CertificationModel;
  @observable private _errors: FormErrors = {};

  constructor(repositories: Repositories) {
    super();
    this.certificationRepository = repositories.certificationRepository;
  }

  hydrate(certification: CertificationModel) {
    this._certification = certification;
    this._errors = {};
  }

  @computed
  get certification() {
    return this._certification;
  }

  @computed
  get errors() {
    return this._errors;
  }

  @action.bound
  setErrors(errors: FormErrors) {
    this._errors = errors;
  }

  @action.bound
  setCertificationTitle(title: string) {
    this._certification = Object.assign({}, this._certification, {title: title.toUpperCase()});
  }

  @action.bound
  async update() {
    this._certification = await this.certificationRepository.update(this._certification);
  }
}