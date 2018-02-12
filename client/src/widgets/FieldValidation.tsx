import * as React from 'react';
import * as classNames from 'classnames';
import styled from 'styled-components';
import { observer } from 'mobx-react';

interface Props {
  name: string;
  children: JSX.Element;
  errors: object[];
  className?: string;
}

@observer
export class FieldValidation extends React.Component<Props> {
  fieldHasError() {
    if (this.props.errors.length === 0) {
      return false;
    }
    return this.props.errors.findIndex(error => error.hasOwnProperty(this.props.name)) > -1;
  }

  render() {
    return (
      <div className={classNames(this.props.className, {error: this.fieldHasError()})}>
        {this.props.children}
        {this.fieldHasError() && <div className="error-msg">This field is required.</div>}
      </div>
    );
  }
}

export default styled(FieldValidation)`
  &.error {
    input[type="text"], input[type="date"] {
      border-bottom: 1px solid ${props => props.theme.yellow};
    } 
    
    .error-msg{
      width:fit-content;
      background: ${props => props.theme.yellow};
      color: ${props => props.theme.darkest};
      font-weight: 600;
    }
  }
`;