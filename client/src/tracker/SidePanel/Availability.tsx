import * as React from 'react';
import { Moment } from 'moment';
import styled from 'styled-components';

interface Props {
  week: Moment[];
  className?: string;
}

export const Availability = (props: Props) => {
  const {week} = props;
  return (
    <div className={props.className}>
      <h3>
        {week[0].format('DD MMM').toUpperCase()} - {week[6].format('DD MMM').toUpperCase()}
      </h3>
      <div className="availability">
        {
          week.map((day, index) => {
            return (
              <div key={index}>
                <div className="event_date">{day.format('ddd, DD MMM YY').toUpperCase()}</div>
                <div className="event_name">No Events Scheduled</div>
              </div>
            );
          })
        }
      </div>
    </div>
  );
};

export default styled(Availability)`
  width: 100%;
  text-align: center;
  
  h3 {
    font-size: 0.875rem;
    font-weight: 500;
  }
  .event_date {
    text-align: left;
    font-size: 0.75rem;
  }  

  .event_name {
    color: ${props => props.theme.graySteel};
    border-bottom: ${props => props.theme.graySteel} 1px solid;
    margin: 1.5rem 20%;
  }
`;
