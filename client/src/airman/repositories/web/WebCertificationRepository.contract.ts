import CertificationRepositoryContract from '../CertificationRepositoryContract';
import WebCertificationRepository from './WebCertificationRepository';

describe('WebCertificationRepository', () => {
const HOST = process.env.REACT_APP_HOST || 'http://localhost:8080';
CertificationRepositoryContract(new WebCertificationRepository(HOST));
});
