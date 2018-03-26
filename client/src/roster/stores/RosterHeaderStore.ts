import { FilterOption, UnfilteredValue } from '../../widgets/models/FilterOptionModel';
import { action, computed, observable } from 'mobx';
import { QualificationModel } from '../../skills/models/QualificationModel';
import { CertificationModel } from '../../skills/models/CertificationModel';
import { AirmanModel, ShiftType } from '../../airman/models/AirmanModel';
import * as Fuse from 'fuse.js';

interface SiteIdContainer {
  selectedSite: number;
}

export class RosterHeaderStore {
  @observable private _selectedCertifications: number[] = [];
  @observable private _selectedQualifications: number[] = [];
  @observable private _selectedShift: number = UnfilteredValue;
  @observable private _selectedLastName: string = '';
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
  get certificationOptions() {
    return this._certifications.filter((cert: CertificationModel) => {
      return cert.siteId === this.siteIdContainer.selectedSite || this.siteIdContainer.selectedSite === UnfilteredValue;
    }).map(cert => {
      return {value: cert.id, label: cert.title};
    });
  }

  @computed
  get selectedCertifications() {
    return this._selectedCertifications;
  }

  @action.bound
  setSelectedCertifications(options: FilterOption[]) {
    this._selectedCertifications = options.map(option => Number(option.value));
  }

  @computed
  get qualificationOptions() {
    return this._qualifications.map(qual => {
      return {value: qual.id, label: `${qual.acronym}`};
    });
  }

  @computed
  get selectedQualifications() {
    return this._selectedQualifications;
  }

  @action.bound
  setSelectedQualifications(options: FilterOption[]) {
    this._selectedQualifications = options.map(option => Number(option.value));
  }

  @computed
  get selectedShift() {
    return this._selectedShift;
  }

  @action.bound
  setSelectedShift(shift: number) {
    this._selectedShift = shift;
  }

  get shiftOptions() {
    return Object.keys(ShiftType).map((key, index) => {
      return {label: ShiftType[key], value: index};
    });
  }

  @computed
  get selectedLastName() {
    return this._selectedLastName;
  }

  @action.bound
  setSelectedLastName = (e: any) => {
    this._selectedLastName = e.target.value;
  }

  filterAirmen(airmen: AirmanModel[]) {
    const filteredAirmen = airmen
      .filter(this.byShift)
      .filter(this.byQualifications)
      .filter(this.byCertifications);
    return this.filterByLastName(filteredAirmen);
  }

  private byShift = (airman: AirmanModel) => {
    if (this._selectedShift === UnfilteredValue) {
      return true;
    }
    return airman.shift === Object.keys(ShiftType)[this._selectedShift];
  }

  private byQualifications = (airman: AirmanModel) => {
    return this._selectedQualifications.every(val => airman.qualificationIds.includes(val));
  }

  private byCertifications = (airman: AirmanModel) => {
    return this._selectedCertifications.every(val => airman.certificationIds.includes(val));
  }

  private filterByLastName = (airmen: AirmanModel[]): AirmanModel[] => {
    if (this._selectedLastName === '') {
      return airmen;
    }
    return new Fuse(airmen, {keys: ['lastName'], threshold: 0.2, }).search(this._selectedLastName);
  }
}