import * as React from 'react';

import { WebService } from '../utils/WebService';

interface Props {
  webService: WebService;
}

interface State {
  phrase: string;
}

class Greeting extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { phrase: '' };
  }

  async getGreeting() {
    const response = await this.props.webService.get('/greeting');
    this.setState({ phrase: response.phrase });
  }

  componentDidMount() {
    this.getGreeting();
  }

  render() {
    return <h1>{this.state.phrase}</h1>;
  }
}

export default Greeting;