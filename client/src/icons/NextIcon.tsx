import * as React from 'react';

export default () => {
  return (
    <svg width="0.75rem" height="0.75rem" viewBox="0 0 24 24">
      <defs>
        <path id="a" d="M12 6l12 12H0z"/>
      </defs>
      <g fill="none" fillRule="evenodd">
        <mask id="b" fill="#fff">
          <use xlinkHref="#a"/>
        </mask>
        <use fill="#9CA9B9" transform="rotate(90 12 12)" xlinkHref="#a"/>
      </g>
    </svg>
  );
};