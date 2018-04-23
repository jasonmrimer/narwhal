import { action, computed, observable } from 'mobx';
import { TimeService } from '../../tracker/services/TimeService';
import { Moment } from 'moment';

export class PlannerStore {
  private timeService: TimeService;

  @observable private _plannerWeek: Moment[] = [];
  @observable private _sidePanelWeek: Moment[] = [];

  constructor(timeService: TimeService) {
    this.timeService = timeService;
    this._plannerWeek = this.timeService.getCurrentWeek();
    this._sidePanelWeek = this.timeService.getCurrentWeek();
  }

  @computed
  get plannerWeek() {
    return this._plannerWeek;
  }

  @action.bound
  incrementPlannerWeek() {
    this._plannerWeek = this.timeService.incrementWeek(this.plannerWeek);
    this._sidePanelWeek = this.timeService.incrementWeek(this.sidePanelWeek);
  }

  @action.bound
  decrementPlannerWeek() {
    this._plannerWeek = this.timeService.decrementWeek(this.plannerWeek);
    this._sidePanelWeek = this.timeService.decrementWeek(this.sidePanelWeek);
  }

  @action.bound
  setSidePanelWeek(week: Moment[]) {
    this._sidePanelWeek = week;
  }

  @computed
  get sidePanelWeek() {
    return this._sidePanelWeek;
  }

  @action.bound
  async navigateToWeek(date: Moment) {
    this._sidePanelWeek = this.timeService.navigateToWeek(date);
  }

  @action.bound
  async incrementSidePanelWeek() {
    this._sidePanelWeek = this.timeService.incrementWeek(this._sidePanelWeek);
  }

  @action.bound
  async decrementSidePanelWeek() {
    this._sidePanelWeek = this.timeService.decrementWeek(this._sidePanelWeek);
  }
}
