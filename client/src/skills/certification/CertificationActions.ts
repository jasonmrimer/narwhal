import { Stores } from '../../app/stores';

export class CertificationActions {
  constructor(private stores: Partial<Stores>) {
  }

  submit = async (e: any) => {
      e.preventDefault();
      try {
        await this.stores.certificationFormStore!.update();
        this.stores.certificationFormStore!.setErrors({});
      } catch (e) {
        this.stores.certificationFormStore!.setErrors(e);
      }
  }
}