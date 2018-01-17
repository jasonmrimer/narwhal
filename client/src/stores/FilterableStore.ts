import FilterOption from '../widgets/models/FilterOptionModel';

export interface FilterableStore {
  readonly options: FilterOption[];
  readonly currentOptionId: number;
  readonly isDisabled: boolean;
}