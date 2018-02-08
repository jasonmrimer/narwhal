import * as React from 'react';
import { Option, OptionValues } from 'react-select';
import 'react-select/dist/react-select.css';
import StyledSelect from './StyledSelect';

const emptyOption = {
  value: '',
  label: ''
};

interface Props {
  options: any;
  handleChange: (value: any) => void;
}

interface State {
  selectedOption: Option<OptionValues>;
}

export default class TypeAheadInput extends React.Component<Props, State> {
  state = {
    selectedOption: emptyOption
  };

  render() {
    return (
      <StyledSelect
        options={this.props.options}
        onChange={this.setSelectedValue}
        value={this.state.selectedOption}
      />

    );
  }

  private setSelectedValue = (selectedOption: Option<OptionValues>) => {
    this.setState({selectedOption});
    if (selectedOption) {
      this.props.handleChange(selectedOption!.value);
    }
  }
}
