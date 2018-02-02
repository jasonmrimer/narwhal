import * as React from 'react';

interface Props {
  width: number;
  height: number;
}

export default (props: Props) => {
  return (
    <svg width={props.width} height={props.height} viewBox="0 0 24 24">
      <path fill="#FFF" fillRule="evenodd" d="M0 12L12 0v24z"/>
    </svg>
  );
};