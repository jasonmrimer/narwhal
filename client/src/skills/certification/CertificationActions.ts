import { Stores } from '../../app/stores';
import { Repositories } from '../../utils/Repositories';
import { CertificationModel } from './models/CertificationModel';

export class CertificationActions {
  constructor(
    private stores: Partial<Stores>,
    private repositories: Partial<Repositories>
  ) {
  }

  submit = async (history: any) => {
    try {
      const certification = this.stores.certificationFormStore!.certification;
      if (certification.id != null) {
        await this.repositories.certificationRepository!.update(certification as CertificationModel);
      } else {
        const savedCertification = await this.repositories.certificationRepository!.save(certification);
        history.replace(`/certifications/${savedCertification.id}`);
      }
      this.stores.certificationFormStore!.setDidSave(true);
      this.stores.certificationFormStore!.setErrors({});
    } catch (e) {
      this.stores.certificationFormStore!.setErrors(e);
    }
  }
}