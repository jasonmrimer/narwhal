interface ProfileRepository {
  findOne(): Promise<{username: string}>;
}

export default ProfileRepository;
