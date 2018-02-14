import * as React from 'react';

export const LeaveIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      width="18"
      height="18"
      viewBox="0 0 24 24"
    >
      <defs>
        <path id="a" d="M12 24C5.373 24 0 18.627 0 12S5.373 0 12 0s12 5.373 12 12-5.373 12-12 12z"/>
      </defs>
      <g fill="none" fillRule="evenodd">
        <use fill="#FFF" fillRule="nonzero" xlinkHref="#a"/>
        <path fill="#000" d="M10.63 15.572h4.518v1.381H8.9V7h1.73z"/>
      </g>
    </svg>
  );
};