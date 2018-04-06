import { action, computed, observable } from 'mobx';
import * as moment from 'moment';

export interface UniqueModel {
  id: number | null;
}

export abstract class FormStore<T extends UniqueModel, S> {
  @observable protected model: T | null = null;
  @observable protected _state: S;
  @observable protected _errors: object[] = [];

  protected abstract modelToState(model: T | null): S;

  protected abstract emptyState(): S;

  public abstract addModel(airmanId: number): void;

  public abstract removeModel(): void;

  @action
  open(model: T | null = null) {
    this._errors = [];
    this.model = model;
    this._state = this.modelToState(model);
  }

  @action
  close() {
    this._errors = [];
    this.model = null;
    this._state = this.emptyState();
  }

  @computed
  get state() {
    return this._state;
  }

  @action
  setState(key: keyof S, value: string) {
    this._state = Object.assign({}, this._state, {[key]: value});
  }

  @computed
  get errors() {
    return this._errors;
  }

  @action
  setErrors(errors: object[]) {
    this._errors = errors;
  }

  @computed
  get hasModel() {
    return this.model != null && this.model!.id != null;
  }

  protected makeMoment(date: string, time: string) {
    if (date === '') {
      return moment.invalid();
    }
    return moment(`${date} ${time}`, 'YYYY-MM-DD HHmm');
  }
}