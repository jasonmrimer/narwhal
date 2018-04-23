import { EventModel, EventType } from '../models/EventModel';
import { FormStore } from '../../widgets/stores/FormStore';
import { action, computed } from 'mobx';
import { TimeService } from '../../tracker/services/TimeService';

interface State {
  description: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
}

export class LeaveFormStore extends FormStore<EventModel, State> {
  constructor(private timeService: TimeService) {
    super();
    this._state = {
      description: '',
      startDate: '',
      startTime: '',
      endDate: '',
      endTime: ''
    };
  }

  @action
  setState(key: keyof State, value: string): void {
    if (key === 'startDate' && !this._state.endDate) {
      super.setState('endDate', value);
    }
    super.setState(key, value);
  }

  protected modelToState(item: EventModel | null): State {
    if (item == null) {
      return this.emptyState();
    }
    return {
      description: item.description,
      startDate: item.startTime.format('YYYY-MM-DD'),
      startTime: item.startTime.format('HHmm'),
      endDate: item.endTime.format('YYYY-MM-DD'),
      endTime: item.endTime.format('HHmm'),
    };
  }

  protected emptyState(): State {
    return {
      description: '',
      startDate: '',
      startTime: '0000',
      endDate: '',
      endTime: '2359'
    };
  }

  addModel(airmanId: number) {
    return new EventModel(
      'Leave',
      this._state.description,
      this.makeMoment(this._state.startDate, this._state.startTime),
      this.makeMoment(this._state.endDate, this._state.endTime),
      airmanId,
      EventType.Leave,
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