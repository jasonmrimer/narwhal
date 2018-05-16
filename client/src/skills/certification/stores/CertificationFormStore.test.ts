import { CertificationFormStore } from './CertificationFormStore';
import { DoubleRepositories } from '../../../utils/Repositories';
import { CertificationModelFactory } from '../factories/CertificationModelFactory';

describe('CertificationFormStore', () => {
  let subject: CertificationFormStore;

  beforeEach(() => {
    DoubleRepositories.certificationRepository.update = jest.fn();
    subject = new CertificationFormStore(DoubleRepositories);
    subject.hydrate(CertificationModelFactory.build(1, 1));
  });

  it('should save the certification when save is called', async () => {
    subject.setCertificationTitle('New Title');

    const newCertification = subject.certification;
    await subject.update();

    expect(DoubleRepositories.certificationRepository.update).toHaveBeenCalledWith(newCertification);
  });
});