import { ProfileActions } from './ProfileActions';
import { AirmanModelFactory } from '../../airman/factories/AirmanModelFactory';

describe('ProfileActions', () => {
  it('should set a confirmation show if successful on saving', async () => {
    const airmanProfileManagerStore: any = {
      airman: AirmanModelFactory.build(),
      setLoading: jest.fn(),
      addAirman: jest.fn(),
      setErrors: jest.fn(),
      setDidSaveAirman: jest.fn()
    };

    const history: any = {
      push: jest.fn()
    };

    const subject = new ProfileActions({airmanProfileManagerStore});

    await subject.handleFormSubmit(history);

    expect(airmanProfileManagerStore.setDidSaveAirman).toHaveBeenCalledWith(true);
  });
});