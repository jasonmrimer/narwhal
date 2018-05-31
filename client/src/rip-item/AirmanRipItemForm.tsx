import * as React from 'react';
import { AirmanRipItemModel } from '../airman/models/AirmanRipItemModel';
import styled from 'styled-components';
import { StyledDatePicker } from '../widgets/inputs/DatePicker';
import * as moment from 'moment';
import { inject, observer } from 'mobx-react';
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
  onChange = (e: any, id: number) => {
    this.props.ripItemsActions!.updateRipItem(id, moment(e.target.value));
  }

  onUpdateClicked = (id: number) => {
    const expirationDate = this.getExpirationDate();
    this.props.ripItemsActions!.updateRipItem(id, expirationDate);
  }

  onUpdateAllClicked = () => {
    const expirationDate = this.getExpirationDate();
    this.props.ripItemsActions!.updateAllRipItems(expirationDate);
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
        performLoading={this.props.trackerStore!.performLoading}
      >
        <h3>RIP Task Expiration Dates</h3>
        <StyledFormRow reversed={true}>
          <StyledButton
            className="update-all-btn"
            text="ALL 90 DAYS"
            onClick={this.onUpdateAllClicked}
            renderIcon={ResetIcon}
          />
        </StyledFormRow>
        {ripItems.map((item: AirmanRipItemModel, index: number) => {
            return (
              <StyledFormRow key={index} direction="column">
                <div className={classNames('item', {expired: item.isExpired})}>
                  {item.ripItem.title}
                </div>
                <div className="item-date-controls">
                  <StyledDatePicker
                    className="item-date-input"
                    value={item.expirationDate ? item.expirationDate.format('YYYY-MM-DD') : ''}
                    onChange={(e) => this.onChange(e, item.id)}
                    name={item.ripItem.title}
                  />
                  <StyledButton
                    className="item-date-button"
                    text="90 DAYS"
                    onClick={() => this.onUpdateClicked(item.id)}
                    renderIcon={ResetIcon}
                  />
                </div>
              </StyledFormRow>
            );
          }
        )}
        <StyledFormRow className="confirm-row" reversed={true}>
          <StyledSubmitButton text="CONFIRM"/>
        </StyledFormRow>
      </StyledForm>
    );
  }

  private getExpirationDate() {
    return moment().add(90, 'days').startOf('day');
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
  
  .update-all-btn {
    width: 100%;
    justify-content: center;
  }

  .item {
    margin: 0 0 0.5rem 0;
    color: ${props => props.theme.purpleSteel};
  }
  
  .item-date-controls {
    width: 100%;
    justify-content: space-between;
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
  
  .confirm-row {
    margin-top: 1.5rem;
    margin-bottom: 1rem;
  }
`);