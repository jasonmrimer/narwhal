import * as React from 'react';
import 'react-select/dist/react-select.css';
import StyledSelect from './StyledSelect';
import FilterOption from './widgets/models/FilterOptionModel';

const emptyOption = {
  value: '',
  label: ''
};

interface Props {
  options: any;
  handleChange: (value: any) => void;
  placeholder: string;
}

interface State {
  selectedOption: FilterOption;
}

export default class TypeAheadInput extends React.Component<Props, State> {
  state = {
    selectedOption: emptyOption
  };

  render() {
    return (
      <StyledSelect
        items={this.props.options}
        onChange={this.setSelectedValue}
        placeholder={this.props.placeholder}
      />
    );
  }

  private setSelectedValue = (item: FilterOption) => {
    if (item) {
      this.props.handleChange(item);
    }
  }
}
