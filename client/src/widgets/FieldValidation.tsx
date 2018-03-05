import * as React from 'react';
import * as classNames from 'classnames';
import styled from 'styled-components';
import { observer } from 'mobx-react';

interface Props {
  name: string;
  errors: object[];
  children?: JSX.Element | JSX.Element[];
  className?: string;
}

@observer
export class FieldValidation extends React.Component<Props> {
  findErrorIndex() {
    if (this.props.errors.length === 0) {
      return -1;
    }
    return this.props.errors.findIndex(error => error.hasOwnProperty(this.props.name));
  }

  render() {
    const errorIndex = this.findErrorIndex();
    const hasError = errorIndex > -1;
    return (
      <div className={classNames(this.props.className, {error: hasError})}>
        {this.props.children}
        {hasError && <div className="error-msg">
          {this.props.errors[errorIndex][this.props.name]}
        </div>}
      </div>
    );
  }
}

export const StyledFieldValidation = styled(FieldValidation)`
  &.error {
    input[type="text"], input[type="date"] {
      border-bottom: 1px solid ${props => props.theme.yellow};
    } 
    
    .error-msg{
      padding: 0.25rem;
      width:fit-content;
      background: ${props => props.theme.yellow};
      color: ${props => props.theme.darkest};
      font-weight: 600;
    }
  }
`;