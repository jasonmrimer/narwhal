import { action, computed, observable } from 'mobx';
import { TimeService } from '../../tracker/services/TimeService';
import { Moment } from 'moment';
import { AirmanModel } from '../../airman/models/AirmanModel';

interface EventsRefresher {
  refreshEvents(): Promise<void>;
  refreshAirmanEvents(): Promise<void>;
}

export class PlannerStore {
  private timeService: TimeService;
  private eventsRefresher: EventsRefresher;

  @observable private _plannerWeek: Moment[] = [];
  @observable private _sidePanelWeek: Moment[] = [];

  constructor(timeService: TimeService, eventsRefresher: EventsRefresher) {
    this.timeService = timeService;
    this.eventsRefresher = eventsRefresher;
    this._plannerWeek = this.timeService.getCurrentWeek();
    this._sidePanelWeek = this.timeService.getCurrentWeek();
  }

  @computed
  get plannerWeek() {
    return this._plannerWeek;
  }

  @action.bound
  async incrementPlannerWeek() {
    this._plannerWeek = this.timeService.incrementWeek(this.plannerWeek);
    this._sidePanelWeek = this.timeService.incrementWeek(this.sidePanelWeek);
    await this.eventsRefresher.refreshEvents();
    await this.eventsRefresher.refreshAirmanEvents();
  }

  @action.bound
  async decrementPlannerWeek() {
    this._plannerWeek = this.timeService.decrementWeek(this.plannerWeek);
    this._sidePanelWeek = this.timeService.decrementWeek(this.sidePanelWeek);
    await this.eventsRefresher.refreshEvents();
    await this.eventsRefresher.refreshAirmanEvents();
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
    await this.eventsRefresher.refreshAirmanEvents();
  }

  @action.bound
  async decrementSidePanelWeek() {
    this._sidePanelWeek = this.timeService.decrementWeek(this._sidePanelWeek);
    await this.eventsRefresher.refreshAirmanEvents();
  }

  isAvailableToWork(airman: AirmanModel, day: Moment) {
    const schedulesBeforeDay = airman.schedules.filter(schedule => {
      return schedule.startDate.isSameOrBefore(day, 'day');
    });

    if (schedulesBeforeDay) {
      const currentSchedule = schedulesBeforeDay.find(schedule => schedule.endDate === null);
      if (currentSchedule) {
        return currentSchedule.isScheduledWorkDay(day);
      } else {
        const pastSchedule = schedulesBeforeDay.find(schedule => day.isBetween(schedule.startDate, schedule.endDate!));
        if (pastSchedule) {
          return pastSchedule.isScheduledWorkDay(day);
        }
      }
    }
    return true;
  }
}
