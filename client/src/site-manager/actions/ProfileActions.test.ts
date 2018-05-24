import { ProfileActions } from './ProfileActions';
import { AirmanModelFactory } from '../../airman/factories/AirmanModelFactory';

describe('ProfileActions', () => {
  let airmanRepository: any;
  let airmanProfileManagerStore: any;
  let history: any;
  let subject: ProfileActions;

  beforeEach(() => {
    airmanRepository = {
      delete: jest.fn()
    };

    airmanProfileManagerStore = {
      airman: AirmanModelFactory.build(),
      pendingDeleteAirman: true,
      setLoading: jest.fn(),
      addAirman: jest.fn(),
      setErrors: jest.fn(),
      setDidSaveAirman: jest.fn(),
      setPendingDeleteAirman: jest.fn(),
      performLoading: async (fun: any) => {await fun()}
    };

    history = {
      replace: jest.fn()
    };

    subject = new ProfileActions({airmanProfileManagerStore}, {airmanRepository});
  });

  it('should set a confirmation show if successful on saving', async () => {
    await subject.handleFormSubmit(history);
    expect(airmanProfileManagerStore.setDidSaveAirman).toHaveBeenCalledWith(true);
  });

  it('should setPendingDelete an airman', async () => {
    await subject.deleteAirman(history);
    expect(airmanRepository.delete).toHaveBeenCalledWith(airmanProfileManagerStore.airman);
    expect(airmanProfileManagerStore.setPendingDeleteAirman).toHaveBeenCalledWith(false);
    expect(history.replace).toHaveBeenCalledWith('/flights');
  });
});