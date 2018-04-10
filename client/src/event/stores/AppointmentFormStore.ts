import { FormStore } from '../../widgets/stores/FormStore';
import { EventModel, EventType } from '../models/EventModel';
import { action } from 'mobx';
import { EventActions } from './EventActions';
import * as moment from 'moment';

interface State {
  title: string;
  description: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
}

export class AppointmentFormStore extends FormStore<EventModel, State> {
  constructor(private eventActions: EventActions) {
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
  async addModel(airmanId: number) {
    const event = new EventModel(
      this._state.title,
      this._state.description,
      this.makeMoment(this._state.startDate, this._state.startTime),
      this.makeMoment(this._state.endDate, this._state.endTime),
      airmanId,
      EventType.Appointment,
      this.model ? this.model.id : null
    );
    await this.eventActions.addEvent(event);
  }

  @action.bound
  removeModel(): void {
    if (this.model != null) {
      this.eventActions.removeEvent(this.model);
    }
  }
}