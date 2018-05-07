import { FormStore } from '../../widgets/stores/FormStore';
import { EventModel, EventType } from '../models/EventModel';
import { action, computed } from 'mobx';
import * as moment from 'moment';
import { TimeService } from '../../tracker/services/TimeService';

interface State {
  title: string;
  description: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
}

export class AppointmentFormStore extends FormStore<EventModel, State> {
  constructor(private timeService: TimeService) {
    super();
    this._state = {
      title: '',
      description: '',
      startDate: '',
      startTime: '',
      endDate: '',
      endTime: ''
    };
  }

  @action
  setState(key: keyof State, value: string) {
    if (key === 'startDate' && !this._state.endDate) {
      super.setState('endDate', value);
    } else if (key === 'startTime' && !this._state.endTime && value.length === 4) {
      super.setState('endTime', moment(value, 'HHmm').add(1, 'h').format('HHmm'));
    }
    super.setState(key, value);
  }

  protected modelToState(model: EventModel | null): State {
    if (model == null) {
      return this.emptyState();
    }
    return {
      title: model.title,
      description: model.description,
      startDate: model.startTime.format('YYYY-MM-DD'),
      startTime: model.startTime.format('HHmm'),
      endDate: model.endTime.format('YYYY-MM-DD'),
      endTime: model.endTime.format('HHmm')
    };
  }

  protected emptyState(): State {
    return {
      title: '',
      description: '',
      startDate: '',
      startTime: '',
      endDate: '',
      endTime: ''
    };
  }

  @action.bound
  stateToModel(airmanId: number) {
    return new EventModel(
      this._state.title,
      this._state.description,
      this.makeMoment(this._state.startDate, this._state.startTime),
      this.makeMoment(this._state.endDate, this._state.endTime),
      airmanId,
      EventType.Appointment,
      this.model ? this.model.id : null
    );
  }

  @computed
  get week() {
    if (this.model) {
      return this.timeService.navigateToWeek(this.model.startTime);
    } else {
      return this.timeService.getCurrentWeek();
    }
  }
}