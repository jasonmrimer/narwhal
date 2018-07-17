import { FilterOption, UnfilteredValue } from '../../widgets/inputs/FilterOptionModel';
import { action, computed, observable, toJS } from 'mobx';
import { QualificationModel } from '../../skills/qualifications/models/QualificationModel';
import { CertificationModel } from '../../skills/certification/models/CertificationModel';
import { AirmanModel, ShiftType } from '../../airman/models/AirmanModel';
import * as Fuse from 'fuse.js';

export class RosterHeaderStore {
  private _siteId: number = UnfilteredValue;
  @observable private _selectedCertificationOptions: FilterOption[] = [];
  @observable private _selectedQualificationOptions: FilterOption[] = [];
  @observable private _selectedShift: FilterOption;
  @observable private _selectedLastName: string = '';
  @observable private _certifications: CertificationModel[] = [];
  @observable private _qualifications: QualificationModel[] = [];

  @action.bound
  hydrate(siteId: number, certifications: CertificationModel[], qualifications: QualificationModel[]) {
    this._siteId = siteId;
    this._certifications = certifications;
    this._qualifications = qualifications;
  }

  @computed
  get certificationOptions() {
    return this._certifications.filter((cert: CertificationModel) => {
      return cert.siteId === this._siteId || this._siteId === UnfilteredValue;
    }).map(cert => {
      return {value: cert.id, label: cert.title};
    });
  }

  @computed
  get selectedCertificationOptions() {
    return toJS(this._selectedCertificationOptions);
  }

  @action.bound
  setSelectedCertificationOptions(options: FilterOption[]) {
    this._selectedCertificationOptions = options;
  }

  @computed
  get qualificationOptions() {
    return this._qualifications.map(qual => {
      return {value: qual.id, label: `${qual.acronym}`};
    });
  }

  @computed
  get selectedQualificationOptions() {
    return toJS(this._selectedQualificationOptions);
  }

  @action.bound
  setSelectedQualificationOptions(options: FilterOption[]) {
    this._selectedQualificationOptions = options;
  }

  @computed
  get selectedShift() {
    return this._selectedShift;
  }

  @action.bound
  setSelectedShift = (e: FilterOption) => {
    this._selectedShift = e;
  }

  get shiftOptions() {
    const allShift = [{label: 'All', value: -1}];
    const realShifts = Object.keys(ShiftType).map((key, index) => {
      return {label: ShiftType[key], value: index};
    });

    return allShift.concat(realShifts);
  }

  @computed
  get selectedLastName() {
    return this._selectedLastName;
  }

  @action.bound
  setSelectedLastName = (e: any) => {
    this._selectedLastName = e.target.value;
  }

  filterAirmen = (airmen: AirmanModel[]) => {
    const filteredAirmen = airmen
      .filter(this.byShift)
      .filter(this.byQualifications)
      .filter(this.byCertifications);
    return this.filterByLastName(filteredAirmen);
  }

  private byShift = (airman: AirmanModel) => {
    if (
      this._selectedShift === undefined ||
      this._selectedShift === null ||
      this._selectedShift.label === 'All'
    ) {
      return true;
    }

    return airman.shift === Object.keys(ShiftType)[this._selectedShift.value];
  }

  private byQualifications = (airman: AirmanModel) => {
    return this._selectedQualificationOptions
      .map(opt => opt.value)
      .every((val: number) => airman.qualificationIds.includes(val));
  }

  private byCertifications = (airman: AirmanModel) => {
    return this._selectedCertificationOptions
      .map(opt => opt.value)
      .every((val: number) => airman.certificationIds.includes(val));
  }

  private filterByLastName = (airmen: AirmanModel[]): AirmanModel[] => {
    if (this._selectedLastName === '') {
      return airmen;
    }
    return new Fuse(airmen, {keys: ['lastName'], threshold: 0.2, }).search(this._selectedLastName);
  }
}