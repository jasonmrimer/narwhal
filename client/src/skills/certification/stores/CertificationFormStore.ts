import { action, computed, observable } from 'mobx';
import { CertificationModel } from '../models/CertificationModel';
import { Repositories } from '../../../utils/Repositories';
import { NotificationStore } from '../../../widgets/stores/NotificationStore';
import { CertificationRepository } from '../repositories/CertificationRepository';

export class CertificationFormStore extends NotificationStore {
  private certificationRepository: CertificationRepository;

  @observable private _certification: CertificationModel;

  constructor(repositories: Repositories) {
    super();
    this.certificationRepository = repositories.certificationRepository;
  }

  hydrate(certification: CertificationModel) {
    this._certification = certification;
  }

  @computed
  get certification() {
    return this._certification;
  }

  @action.bound
  setCertificationTitle(title: string) {
    this._certification = Object.assign({}, this._certification, {title: title});
  }

  @action.bound
  async update() {
    this._certification = await this.certificationRepository.update(this._certification);
  }
}