import * as React from 'react';

/* tslint:disable:max-line-length */
export const AddIcon = () => {
  const pathD = 'M8.98854 0.380961C8.98861 -0.126992 6.99907 -0.126984 7.00005 0.380969L6.98191 1.2508C6.98589 ' +
    '2.50408 6.99244 4.49654 6.99892 7H0.379922C-0.1281 7 -0.125872 8.99997 0.382011 9L7.00108 9C7.00952 12.4832 ' +
    '7.01323 15.3782 7.00137 15.6191C6.97633 16.127 9.00011 16.127 9.00011 15.6191C9.00011 15.3783 8.99519 12.4832 ' +
    '8.98927 9H15.6199C16.1277 9 16.1263 7 15.6184 7L8.99932 7C8.99339 3.51681 8.98854 0.621788 8.98854 0.380961Z';

  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 32 32"
      fill="null"
      className="icon"
    >
      <g clip-path="url(#clip0)">
        <path
          d={pathD}
          transform="translate(-0.00012207) scale(2)"
          fill="#FFFFFF"
        />
      </g>
      <defs>
        <clipPath id="clip0">
          <rect width="16" height="16" fill="white" transform="scale(2)"/>
        </clipPath>
      </defs>
    </svg>
  );
};