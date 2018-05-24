import { CertificationActions } from './CertificationActions';
import { CertificationModel } from './models/CertificationModel';

describe('CertificationActions', () => {
  let certificationFormStore: any;
  let certificationRepository: any;
  let history: any;
  let subject: CertificationActions;

  beforeEach(() => {
    certificationFormStore = {
      setErrors: jest.fn(),
      setDidSave: jest.fn(),
      setPendingDelete: jest.fn(),
      certification: new CertificationModel(1, 'fake cert', 2),
    };

    certificationRepository = {
      save: () => {
        return {id: 123};
      },
      update: jest.fn(),
      delete: jest.fn(),
    };

    history = {
      replace: jest.fn()
    };

    subject = new CertificationActions(
      {certificationFormStore} as any,
      {certificationRepository} as any
    );
  });

  it('should save a new certification', async () => {
    certificationFormStore.certification = {title: 'Fake Cert'};
    await subject.submit(history);
    expect(certificationFormStore.setDidSave).toHaveBeenCalledWith(true);
    expect(certificationFormStore.setErrors).toHaveBeenCalledWith({});
    expect(history.replace).toHaveBeenCalledWith('/certifications/123');
  });

  it('should update an existing certification', async () => {
    certificationFormStore.certification = {id: 1, title: 'Fake Cert', siteId: 14};
    await subject.submit(history);
    expect(certificationRepository.update)
      .toHaveBeenCalledWith(certificationFormStore.certification);
    expect(certificationFormStore.setDidSave).toHaveBeenCalledWith(true);
    expect(certificationFormStore.setErrors).toHaveBeenCalledWith({});
  });

  it('should set a pending delete on the store', () => {
    subject.setPendingDelete();
    expect(certificationFormStore.setPendingDelete).toHaveBeenCalledWith(true);
  });

  it('should should dismiss the pending delete', () => {
    subject.dismissPendingDelete();
    expect(certificationFormStore.setPendingDelete).toHaveBeenCalledWith(false);
  });

  it('should call delete on the repository with the correct id', () => {
    const certification = certificationFormStore.certification;

    subject.deleteCertification(history);
    expect(certificationRepository.delete).toHaveBeenCalledWith(certification.id);
  });
});