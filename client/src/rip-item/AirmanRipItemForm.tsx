import * as React from 'react';
import { AirmanRipItemModel } from '../airman/models/AirmanRipItemModel';
import styled from 'styled-components';
import { StyledDatePicker } from '../widgets/inputs/DatePicker';
import * as moment from 'moment';
import { observer, inject } from 'mobx-react';
import { StyledSubmitButton } from '../widgets/forms/SubmitButton';
import { StyledForm, StyledFormRow } from '../widgets/forms/Form';
import { AirmanRipItemFormStore } from './stores/AirmanRipItemFormStore';
import { StyledButton } from '../widgets/buttons/Button';
import * as classNames from 'classnames';
import { ResetIcon } from '../icons/ResetIcon';
import { CurrencyStore } from '../currency/stores/CurrencyStore';
import { TrackerStore } from '../tracker/stores/TrackerStore';
import { RipItemsActions } from './RipItemsActions';

interface Props {
  airmanRipItemFormStore?: AirmanRipItemFormStore;
  trackerStore?: TrackerStore;
  currencyStore?: CurrencyStore;
  ripItemsActions?: RipItemsActions;
  selectedAirmanId: number;
  className?: string;
}

@observer
export class AirmanRipItems extends React.Component<Props> {
  onChange = (e: any, item: AirmanRipItemModel) => {
    this.props.ripItemsActions!.handleChange(moment(e.target.value), item);
  }

  onClick = (item: AirmanRipItemModel) => {
    const expirationDate = moment().add(90, 'days').startOf('day');
    this.props.ripItemsActions!.handleChange(expirationDate, item);
  }

  onSubmit = async (e: any) => {
    e.preventDefault();
    await this.props.ripItemsActions!.submit();
  }

  render() {
    const {airmanRipItemFormStore} = this.props;
    const {ripItems} = airmanRipItemFormStore!;
    return (
      <StyledForm
          className={this.props.className}
          onSubmit={this.onSubmit}
          setLoading={this.props.trackerStore!.setLoading}
      >
        <h3>RIP Task Expiration Dates</h3>
        {ripItems.map((item: AirmanRipItemModel, index: number) => {
            return (
              <StyledFormRow key={index} direction="column">
                <div className={classNames('item', {expired: item.isExpired})}>{item.ripItem.title}</div>
                <div className="item-date-controls">
                  <StyledDatePicker
                    className="item-date-input"
                    value={item.expirationDate ? item.expirationDate.format('YYYY-MM-DD') : ''}
                    onChange={(e) => this.onChange(e, item)}
                    name={item.ripItem.title}
                  />
                  <StyledButton
                    className="item-date-button"
                    text="90 DAYS"
                    onClick={() => this.onClick(item)}
                    renderIcon={ResetIcon}
                  />
                </div>
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

export const StyledRipItems = inject(
  'airmanRipItemFormStore',
  'currencyStore',
  'trackerStore',
  'ripItemsActions'
  )(styled(AirmanRipItems)`
  h3 {
    font-weight: 300;
    font-size: 1.15rem;
    color: ${props => props.theme.fontColor};
    margin: 0;
  }

  .item {
    margin: 0 0 0.5rem 0;
    color: ${props => props.theme.purpleSteel};
  }
  
  .item-date-controls {
    display: flex;
    align-items: flex-end;
  }
  
  .item-date-input {
    margin-right: 1rem;
  }
  
  .item-date-button {
    padding: 0.25rem;
  }
  
  .expired {
    color: ${props => props.theme.yellow};
  }
  
  button {
    &:hover {
      background: ${props => props.theme.fontColor};
      color: ${props => props.theme.darkest};
      
      svg > g {
        fill: ${props => props.theme.darkest};
      }
    }
  }
  
`);