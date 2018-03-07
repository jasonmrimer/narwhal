import * as React from 'react';

/* tslint:disable:max-line-length */
export const AddIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      width="16"
      height="16"
      viewBox="0 0 16 16"
    >
      <defs>
        <circle id="a" cx="8" cy="8" r="8"/>
        <path id="b" d="M7.333 2.667h1.333v10.667H7.333z"/>
        <path id="c" d="M2.667 7.333h10.667v1.333H2.667z"/>
      </defs>
      <g fill="none" fill-rule="evenodd">
        <use fill="#FFF" xlinkHref="#a"/>
        <use fill="#000" xlinkHref="#b"/>
        <use fill="#000" xlinkHref="#c"/>
      </g>
    </svg>
  );
};