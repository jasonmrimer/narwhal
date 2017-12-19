import * as React from 'react';
import AirmanModel from '../airman/models/AirmanModel';
import styled from 'styled-components';

interface Props {
  airmen: AirmanModel[];
  className?: string;
}

const renderPlannerRow = (airmen: AirmanModel[]) => {
  return airmen.map((airman, index) => {
    return (
      <tr key={index}>
        <td><input type="checkbox" /></td>
        <td><input type="checkbox" /></td>
        <td><input type="checkbox" /></td>
        <td><input type="checkbox" /></td>
        <td><input type="checkbox" /></td>
        <td><input type="checkbox" /></td>
        <td><input type="checkbox" /></td>
      </tr>
    );
  });
};

export const Planner = (props: Props) => {
  return (
    <table className={props.className}>
      <caption>Planner</caption>
      <thead>
      <tr>
        <th>SUN</th>
        <th>MON</th>
        <th>TUE</th>
        <th>WED</th>
        <th>THU</th>
        <th>FRI</th>
        <th>SAT</th>
      </tr>
      </thead>
      <tbody>
      {renderPlannerRow(props.airmen)}
      </tbody>
    </table>
  );
};

export default styled(Planner)`
  border-collapse: collapse;
  background-color: ${props => props.theme.dark};
  border: 1px solid ${props => props.theme.lighter};
  margin-top: 0.5rem;
  
  caption {
    display: none;
  }
  
  thead {
    background-color: ${props => props.theme.lighter};
    text-align: left;
    
    th {
      font-size: 0.875rem;
      font-weight: 500;
    }
  };
   
  tbody tr:nth-child(even) {
    background-color: ${props => props.theme.light};
  }
  
  td, th {
    padding: 0.75rem;
  }
`;