import * as React from 'react';

export const CloseIcon = () => {
  return (
    <svg
      width="14px"
      height="14px"
      viewBox="0 0 14 14"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
      <defs>
        <polygon
          id="path-1"
          points={'1601 100.415 1599.585 99 1594 104.585 1588.415 99 1587 100.415 1592.585 106 1587 ' +
          '111.585 1588.415 113 1594 107.415 1599.585 113 1601 111.585 1595.415 106'}
        />
      </defs>
      <g
        id="Roster---Profile-Edit"
        stroke="none"
        strokeWidth="1"
        fill="none"
        fillRule="evenodd"
        transform="translate(-1587.000000, -99.000000)"
      >
        <mask id="mask-2" fill="white">
          <use xlinkHref="#path-1"/>
        </mask>
        <use id="close" fill="#FFFFFF" fillRule="nonzero" xlinkHref="#path-1"/>
      </g>
    </svg>
  );
};
