import QualificationRepositoryContract from '../QualificationRepositoryContract';
import WebQualificationRepository from './WebQualificationRepository';

describe('WebQualificationRepository', () => {
  const HOST = process.env.REACT_APP_HOST || 'http://localhost:8080';
  QualificationRepositoryContract(new WebQualificationRepository(HOST));
});
