import ProfileRepository from '../ProfileRepository';

export class ProfileRepositoryStub implements ProfileRepository {
  findOne(): Promise<{ username: string }> {
    return Promise.resolve({username: 'FooFace'});
  }
}
