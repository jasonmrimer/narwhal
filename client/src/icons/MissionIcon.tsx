import * as React from 'react';

interface Props {
  title: string;
  viewBox: string;
}

/* tslint:disable:max-line-length */
export const MissionIcon = (props: Props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="36"
      height="24"
      viewBox={props.viewBox}
    >
      <g fill="none" fillRule="evenodd">
        <text
          fill="#FFF"
          fontSize="11"
          textAnchor="middle"
        >
          <tspan x="50%" y="16">{props.title}</tspan>
        </text>
        <rect width="35.5" height="17.5" x=".25" y="3.25" stroke="#FFF" strokeWidth="1.5" rx="8"/>
      </g>
    </svg>
  );
};