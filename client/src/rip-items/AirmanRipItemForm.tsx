import * as React from 'react';
import { AirmanRipItemModel } from '../airman/models/AirmanRipItemModel';
import styled from 'styled-components';
import { StyledDatePicker } from '../widgets/DatePicker';
import * as moment from 'moment';
import { observer } from 'mobx-react';
import { StyledSubmitButton } from '../widgets/SubmitButton';
import { StyledForm, StyledFormRow } from '../widgets/Form';
import { AirmanRipItemFormStore } from './stores/AirmanRipItemFormStore';

interface Props {
  selectedAirmanId: number;
  store: AirmanRipItemFormStore;
  className?: string;
}

@observer
export class AirmanRipItems extends React.Component<Props> {
  async componentDidMount() {
    await this.props.store.hydrate(this.props.selectedAirmanId);
  }

  onChange = (e: any, item: AirmanRipItemModel) => {
    const expirationDate = moment(e.target.value);
    item.expirationDate = expirationDate.isValid() ? expirationDate : null;
    this.props.store.updateRipItem(item);
  }

  onSubmit = (e: any) => {
    e.preventDefault();
    this.props.store.submitRipItems();
  }

  render() {
    return (
      <StyledForm className={this.props.className} onSubmit={this.onSubmit}>
        <h3>RIP TASKS</h3>
        {this.props.store.ripItems.map((item: AirmanRipItemModel, index: number) => {
            return (
              <StyledFormRow key={index} direction="column">
                <div className="item">{item.ripItem.title}</div>
                <StyledDatePicker
                  value={item.expirationDate ? item.expirationDate.format('YYYY-MM-DD') : ''}
                  onChange={(e) => this.onChange(e, item)}
                  name={item.ripItem.title}
                />
              </StyledFormRow>
            );
          }
        )}
        <StyledFormRow reversed={true}>
          <StyledSubmitButton text="CONFIRM"/>
        </StyledFormRow>
      </StyledForm>
    );
  }
}

export const StyledRipItems = styled(AirmanRipItems)`
  h3 {
    font-weight: 300;
    font-size: 1rem;
    margin: 0;
    
  }

  .item {
    margin: 0 0 0.5rem 0;
    color: ${props => props.theme.grayishBlueSteel};
  }
`;