import * as React from 'react';
import * as classNames from 'classnames';
import styled from 'styled-components';
import { observer } from 'mobx-react';

export type FormErrors = { [field: string]: string };

interface Props {
  fieldName: string;
  errors: FormErrors;
  rightAlign?: boolean;
  children?: JSX.Element | JSX.Element[];
  className?: string;
}

@observer
export class FieldValidation extends React.Component<Props> {
  render() {
    const message = this.props.errors[this.props.fieldName];
    return (
      <div className={classNames(this.props.className, {error: message != null})}>
        {this.props.children}
        {
          message != null &&
          <div className="error-msg">
            {message}
          </div>
        }
      </div>
    );
  }
}

export const StyledFieldValidation = styled(FieldValidation)`
  &.error {
    input, select {
      border-bottom: 1px solid ${props => props.theme.yellow};
    } 
    
    .error-msg{
      margin-left: ${props => props.rightAlign ? 'auto' : ''};
      padding: 0.25rem;
      width:fit-content;
      background: ${props => props.theme.yellow};
      color: ${props => props.theme.darkest};
      font-weight: 300;
    }
  }
`;