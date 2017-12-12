const airmanOne = {
  firstName: 'First1',
  lastName: 'Last1',
  qualifications: [
    {id: 1, acronym: 'MMS', title: 'My Mission Supervisor'},
    {id: 13, acronym: 'I', title: 'Instructor'},
    {id: 14, acronym: 'E', title: 'Evaluator'},
  ],
  unit: {id: 1, name: '1'}
};

const airmanTwo = {
  firstName: 'First2',
  lastName: 'Last2',
  qualifications: [
    {id: 2, acronym: 'MSA', title: 'Multi Source Analyst'},
    {id: 5, acronym: 'GRE', title: 'Geospatial Reports Editor'},
  ],
  unit: {id: 1, name: '1'}
};

const airmanThree = {
  firstName: 'First3',
  lastName: 'Last3',
  qualifications: [
    {id: 4, acronym: 'IMS', title: 'Imagery Mission Supervisor'}
  ],
  unit: {id: 2, name: '2'}
};

const airmen = [airmanOne, airmanTwo, airmanThree];

export default class AirmanModelFactory {
  static build() {
    return airmen;
  }

  static buildForUnit(unitId: number) {
    return airmen.filter((airman) => airman.unit.id === unitId);
  }
}