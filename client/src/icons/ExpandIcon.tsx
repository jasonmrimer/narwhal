import * as React from 'react';

const path1d = 'M 4.5 3.5L 8 3.5L 8 4.5L 4.5 4.5L 4.5 8L 3.5 8L 3.5 4.5L 0 4.5L 0 3.5L 3.5 3.5L 3.5 0L 4.5 0L 4.5 3.5Z';
const path2d =
  'M 0 0L 1 0L 2 0L 2 1L 1 1L 1 11L 2 11L 2 12L 1 12L 0 12L 0 11L 0 1L 0 0ZM 10 0L 11 0L 12 0L 12 1L 12 11L 12 12L 11 '
  +
  '12L 10 12L 10 11L 11 11L 11 1L 10 1L 10 0Z';
export const ExpandIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      width="24"
      height="24"
      viewBox="0 0 14 14"
    >
      <path
        d={path1d}
        transform="translate(4 4)"
        fill="white"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d={path2d}
        transform="translate(2 2)"
        fill="white"
      />
    </svg>
  );
};