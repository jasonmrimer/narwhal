import * as moment from 'moment';
import CrewModel from '../../crew/model/CrewModel';

const airmanOne = {
  firstName: 'First1',
  lastName: 'Last1',
  qualifications: [
    {id: 1, acronym: 'MMS', title: 'My Mission Supervisor', expirationDate: moment('20180125')},
    {id: 13, acronym: 'I', title: 'Instructor', expirationDate: moment('20180225')},
    {id: 14, acronym: 'E', title: 'Evaluator', expirationDate: moment('20180325')},
  ],
  unit: {id: 1, name: '1'},
  certifications: [
    {id: 1, title: 'Laser Vision', expirationDate: moment('20180126')},
    {id: 2, title: 'Flight', expirationDate: moment('20180126')},
    {id: 3, title: 'Super Speed', expirationDate: moment('20180126')},
  ],
  crews: [new CrewModel(1, 'SUPER CREW')],
};

const airmanTwo = {
  firstName: 'First2',
  lastName: 'Last2',
  qualifications: [
    {id: 2, acronym: 'MSA', title: 'Multi Source Analyst', expirationDate: moment('20180425')},
    {id: 5, acronym: 'GRE', title: 'Geospatial Reports Editor', expirationDate: moment('20180525')},
  ],
  unit: {id: 1, name: '1'},
  certifications: [{id: 1, title: 'Laser Vision', expirationDate: moment('20180126')}],
  crews: [new CrewModel(1, 'SUPER CREW')],
};

const airmanThree = {
  firstName: 'First3',
  lastName: 'Last3',
  qualifications: [
    {id: 4, acronym: 'IMS', title: 'Imagery Mission Supervisor', expirationDate: moment('20180625')}
  ],
  unit: {id: 2, name: '2'},
  certifications: [{id: 1, title: 'Laser Vision', expirationDate: moment('20180126')}],
  crews: [new CrewModel(2, 'NOT SUPER CREW')],
};

/* tslint:disable:no-any*/
const airmen: any[] = [airmanOne, airmanTwo, airmanThree];

export default class AirmanModelFactory {
  static buildList() {
    return airmen;
  }

  static buildForUnit(unitId: number) {
    return airmen.filter((airman) => {
      if (airman.unit) {
        return airman.unit.id === unitId;
      } else {
        return false;
      }
    });
  }

  static build() {
    return airmanOne;
  }

  static buildForCrew(crewId: number) {
    /*tslint:disable:align*/
    return airmen.reduce((prev, airman) => {
      const crewArray = airman.crews.filter((crew: any) => crew.id === crewId);
      if (crewArray.length > 0) {
        return [...prev, airman];
      } else {
        return prev;
      }
    }, []);
  }
}