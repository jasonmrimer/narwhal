import * as React from 'react';
import { ClipLoader } from 'react-spinners';
import styled, { withTheme } from 'styled-components';

interface Props {
  theme?: any;
  className?: string;
}

export const LoadingOverlay = (props: Props) => {
  return (
    <div className={props.className}>
      <ClipLoader color={props.theme!.yellow} size={100}/>
    </div>
  );
};

export const StyledLoadingOverlay = styled(withTheme(LoadingOverlay))`
  position: fixed;
  background: ${props => props.theme.dark};
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  z-index: 999;
  
  & > * {
    position: fixed; 
    top: 50%; 
    left: 47%;
  }
`;