import { CertificationFormStore } from './CertificationFormStore';
import { CertificationModelFactory } from '../factories/CertificationModelFactory';

describe('CertificationFormStore', () => {
  let subject: CertificationFormStore;

  beforeEach(() => {
    subject = new CertificationFormStore();
    subject.hydrate(CertificationModelFactory.build(1, 1));
  });

  it('should set text that was input to certification title to uppercase', () => {
    subject.setCertificationTitle('chicken');
    expect(subject.certification.title).toBe('CHICKEN');
  });

  it('should set pending delete', () => {
    expect(subject.pendingDelete).toBeFalsy();
    subject.setPendingDelete(true);
    expect(subject.pendingDelete).toBeTruthy();
  });

});