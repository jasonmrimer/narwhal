import * as React from 'react';

interface Props {
  onClick?: (e: any) => void;
}
/* tslint:disable:max-line-length */
export const AvailableIcon = (props: Props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      width="36"
      height="24"
      viewBox="0 0 24 29"
      onClick={props.onClick}
    >
      <defs>
        <path id="9lk6a" d="M.96 12a11.04 11.04 0 1 1 22.08 0A11.04 11.04 0 0 1 .96 12zM24 12a12 12 0 1 0-24 0 12 12 0 0 0 24 0z"/>
      </defs>
      <g>
        <g>
          <use fill="#fff" xlinkHref="#9lk6a"/>
        </g>
      </g>
    </svg>
  );
};