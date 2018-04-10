import { action } from 'mobx';
import { FormStore } from '../../widgets/stores/FormStore';
import { EventModel, EventType } from '../models/EventModel';
import { EventActions } from './EventActions';

interface State {
  title: string;
  description: string;
  startTime: string;
  endTime: string;
}

export class TDYDeploymentFormStore extends FormStore<EventModel, State> {
  constructor(private eventActions: EventActions) {
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

  async addModel(airmanId: number) {
    const event = new EventModel(
      this._state.title,
      this._state.description,
      this.makeMoment(this._state.startTime, '0000'),
      this.makeMoment(this._state.endTime, '2359'),
      airmanId,
      EventType.TDY_DEPLOYMENT,
      this.model ? this.model.id : null
    );
    await this.eventActions.addEvent(event);
  }

  removeModel(): void {
    if (this.model != null) {
      this.eventActions.removeEvent(this.model);
    }
  }
}