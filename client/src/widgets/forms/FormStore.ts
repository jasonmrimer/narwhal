import { action, computed, observable } from 'mobx';
import * as moment from 'moment';
import { FormErrors } from '../inputs/FieldValidation';

export interface UniqueModel {
  id: number | null;
}

export abstract class FormStore<T extends UniqueModel, S> {
  @observable protected _model: T | null = null;
  @observable protected _state: S;
  @observable protected _errors: FormErrors = {};

  protected abstract modelToState(model: T | null): S;

  protected abstract emptyState(): S;

  public abstract stateToModel(airmanId: number): T;

  @action
  open(model: T | null = null) {
    this._errors = {};
    this._model = model;
    this._state = this.modelToState(model);
  }

  @action
  close() {
    this._errors = {};
    this._model = null;
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
  setErrors(errors: FormErrors) {
    this._errors = errors;
  }

  @computed
  get hasModel() {
    return this._model != null && this._model!.id != null;
  }

  @computed
  get model() {
    return this._model;
  }

  protected makeMoment(date: string, time: string) {
    if (date === '') {
      return moment.invalid();
    }
    return moment(`${date} ${time}`, 'YYYY-MM-DD HHmm');
  }
}