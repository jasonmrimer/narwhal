import { action, computed } from 'mobx';
import { FormStore } from '../../widgets/stores/FormStore';
import { EventModel, EventType } from '../models/EventModel';
import { TimeService } from '../../tracker/services/TimeService';

interface State {
  title: string;
  description: string;
  startTime: string;
  endTime: string;
}

export class TDYDeploymentFormStore extends FormStore<EventModel, State> {
  constructor(private timeService: TimeService) {
    super();
    this._state = {
      title: '',
      description: '',
      startTime: '',
      endTime: '',
    };
  }

  @action
  setState(key: keyof State, value: string): void {
    if (key === 'startTime' && !this._state.endTime) {
      super.setState('endTime', value);
    }
    super.setState(key, value);
  }

  protected modelToState(item: EventModel | null): State {
    if (item == null) {
      return this.emptyState();
    }
    return {
      title: item.title,
      description: item.description,
      startTime: item.startTime.format('YYYY-MM-DD'),
      endTime: item.endTime.format('YYYY-MM-DD'),
    };
  }

  protected emptyState(): State {
    return {
      title: '',
      description: '',
      startTime: '',
      endTime: '',
    };
  }

  addModel(airmanId: number) {
    return new EventModel(
      this._state.title,
      this._state.description,
      this.makeMoment(this._state.startTime, '0000'),
      this.makeMoment(this._state.endTime, '2359'),
      airmanId,
      EventType.TDY_DEPLOYMENT,
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