import { CertificationActions } from './CertificationActions';

describe('CertificationActions', () => {
  let certificationFormStore: any;
  let certificationRepository: any;
  let history: any;
  let subject: CertificationActions;

  beforeEach(() => {
    certificationFormStore = {
      setErrors: jest.fn(),
      setDidSave: jest.fn()
    };

    certificationRepository = {
      save: () => {
        return {id: 123};
      },
      update: jest.fn()
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
});