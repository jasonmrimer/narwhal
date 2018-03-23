import { FilterOption, UnfilteredValue } from '../../widgets/models/FilterOptionModel';
import { action, computed, observable } from 'mobx';
import { QualificationModel } from '../../skills/models/QualificationModel';
import { CertificationModel } from '../../skills/models/CertificationModel';
import { AirmanModel, ShiftType } from '../../airman/models/AirmanModel';
import * as Fuse from 'fuse.js';
import { filterOptionsBy } from '../../utils/eventUtil';

interface SiteIdContainer {
  siteId: number;
}

export class RosterHeaderStore {
  @observable private _certificationIds: number[] = [];
  @observable private _qualificationIds: number[] = [];
  @observable private _lastNameFilter: string = '';
  @observable private _shiftFilterValue: number = UnfilteredValue;
  @observable private _certifications: CertificationModel[] = [];
  @observable private _qualifications: QualificationModel[] = [];

  constructor(private siteIdContainer: SiteIdContainer) {
  }

  @action.bound
  hydrate(certifications: CertificationModel[], qualifications: QualificationModel[]) {
    this._certifications = certifications;
    this._qualifications = qualifications;
  }

  @computed
  get certifications() {
    return this._certifications;
  }

  @computed
  get certificationOptions() {
    if (this.siteIdContainer.siteId === UnfilteredValue) {
      return this._certifications.map(cert => {
        return {value: cert.id, label: cert.title};
      });
    } else {
      return filterOptionsBy(this._certifications, this.siteIdContainer.siteId);
    }
  }

  @computed
  get certificationIds() {
    return this._certificationIds;
  }

  @action.bound
  setCertificationIds(options: FilterOption[]) {
    this._certificationIds = options.map(option => Number(option.value));
  }

  @computed
  get qualifications() {
    return this._qualifications;
  }

  @computed
  get qualificationOptions() {
    return this._qualifications.map(qual => {
      return {value: qual.id, label: `${qual.acronym} - ${qual.title}`};
    });
  }

  @computed
  get qualificationFilterOptions() {
    return this._qualifications.map(qual => {
      return {value: qual.id, label: `${qual.acronym}`};
    });
  }

  @computed
  get qualificationIds() {
    return this._qualificationIds;
  }

  @action.bound
  setQualificationIds(options: FilterOption[]) {
    this._qualificationIds = options.map(option => Number(option.value));
  }

  @action.bound
  setShiftFilter(shiftValue: number) {
    this._shiftFilterValue = shiftValue;
  }

  @action.bound
  setLastNameFilter = (e: any) => {
    this._lastNameFilter = e.target.value;
  }

  @computed
  get lastNameFilter() {
    return this._lastNameFilter;
  }

  @computed
  get shiftFilter() {
    return this._shiftFilterValue;
  }

  get shiftOptions() {
    return Object.keys(ShiftType).map((key, index) => {
      return {label: ShiftType[key], value: index};
    });
  }

  filterAirmen(airmen: AirmanModel[]) {
    const filteredAirmen = airmen
      .filter(this.byShift)
      .filter(this.byQualifications)
      .filter(this.byCertifications);
    return this.filterByLastName(filteredAirmen);
  }

  private byShift = (airman: AirmanModel) => {
    if (this._shiftFilterValue === UnfilteredValue) {
      return true;
    }
    return airman.shift === Object.keys(ShiftType)[this._shiftFilterValue];
  }

  private byQualifications = (airman: AirmanModel) => {
    if (this._qualificationIds.length === 0) {
      return true;
    }
    return !this._qualificationIds.some(val => airman.qualificationIds.indexOf(val) === -1);
  }

  private byCertifications = (airman: AirmanModel) => {
    if (this._certificationIds.length === 0) {
      return true;
    }
    return !this._certificationIds.some(val => airman.certificationIds.indexOf(val) === -1);
  }

  private filterByLastName = (airmen: AirmanModel[]): AirmanModel[] => {
    if (this._lastNameFilter === '') {
      return airmen;
    }
    const options = {
      keys: ['lastName'],
      threshold: 0.2,
    };

    const fuse = new Fuse(airmen, options);
    return fuse.search(this._lastNameFilter);
  }
}