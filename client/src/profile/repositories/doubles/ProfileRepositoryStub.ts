import ProfileRepository from '../ProfileRepository';

export default class ProfileRepositoryStub implements ProfileRepository {
  findOne(): Promise<{ username: string }> {
    return Promise.resolve({username: 'FooFace'});
  }
}
