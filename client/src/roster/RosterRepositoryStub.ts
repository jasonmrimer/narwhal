import RosterModel from './RosterModel';
import RosterRepository from './RosterRepository';

const airmanOne = {
  firstName: 'First1',
  lastName: 'Last1',
  qualifications: [
    {id: 1, acronym: 'MMS', title: 'My Mission Supervisor'},
    {id: 13, acronym: 'I', title: 'Instructor'},
    {id: 14, acronym: 'E', title: 'Evaluator'},
  ]
};
const airmanTwo = {
  firstName: 'First2',
  lastName: 'Last2',
  qualifications: [
    {id: 2, acronym: 'MSA', title: 'Multi Source Analyst'},
    {id: 5, acronym: 'GRE', title: 'Geospatial Reports Editor'},
  ]
};
const airmanThree = {
  firstName: 'First3',
  lastName: 'Last3',
  qualifications: [
    {id: 4, acronym: 'IMS', title: 'Imagery Mission Supervisor'}
  ]
};

export default class RosterRepositoryStub implements RosterRepository {
  findOne() {
    return Promise.resolve(new RosterModel([airmanOne, airmanTwo, airmanThree]));
  }
}