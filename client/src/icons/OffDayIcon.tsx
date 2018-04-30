import * as React from 'react';

interface Props {
  onClick?: (e: any) => void;
}

const d = 'M 4 2C 4 3.10457 3.10457 4 2 4C 0.895431 4 0 3.10457 0 2C 0 0.895431' +
  ' 0.895431 0 2 0C 3.10457 0 4 0.895431 4 2Z';

export const OffDayIcon = (props: Props) => {
  return (
    <svg
      width="36"
      height="24"
      viewBox="0 0 16 16"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      onClick={props.onClick}
    >
      <path
        d={d}
        transform="translate(6 6)"
        fill="#FFF"
      />
    </svg>
  );
};
