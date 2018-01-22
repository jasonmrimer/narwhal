import * as React from 'react';

export default () => {
  /* tslint:disable:max-line-length*/
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      width="160"
      height="24"
      viewBox="0 0 130 24"
    >
      <defs>
        <path
          id="a"
          d="M2.51 4.3h8.19a.3.3 0 0 1 .3.3v.8a.3.3 0 0 1-.3.3H2.486l3.26 3.26a.318.318 0 0 1 0 .462l-.503.502a.318.318 0 0 1-.462 0l-4.68-4.68a.318.318 0 0 1 0-.463L4.78.101a.318.318 0 0 1 .462 0l.503.502a.318.318 0 0 1 0 .462L2.51 4.3z"/>
      </defs>
      <g fill="none" fillRule="evenodd">
        <text fill="#ADADAD" fontFamily="Roboto-Regular, Roboto" fontSize="14">
          <tspan x="26" y="17">Back to Week View</tspan>
        </text>
        <g transform="translate(6 7)">
          <mask id="b" fill="#fff">
            <use xlinkHref="#a"/>
          </mask>
          <use fill="#ADADAD" xlinkHref="#a"/>
          <g fill="#ADADAD" mask="url(#b)">
            <path d="M-6-7h24v24H-6z"/>
          </g>
        </g>
      </g>
    </svg>
  );
};