import { action, computed, observable, toJS } from 'mobx';
import CertificationRepository from './repositories/CertificationRepository';
import CertificationModel from './models/CertificationModel';
import FilterOption from '../widgets/models/FilterOptionModel';

export class CertificationStore {
  @observable private _certifications: CertificationModel[] = [];
  @observable private _selectedCertificationIds: number[] = [];

  constructor(private repository: CertificationRepository) {}

  @action
  async fetchAllCertifications() {
    this._certifications = await this.repository.findAll();
  }

  @action.bound
  setCertificationIds (options: FilterOption[]) {
    this._selectedCertificationIds = options.map(opt => opt.value);
  }

  @computed
  get certifications() {
    return this._certifications;
  }

  @computed
  get selectedCertificationIds() {
    return toJS(this._selectedCertificationIds);
  }
}