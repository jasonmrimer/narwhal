import * as React from 'react';
import * as moment from 'moment-timezone';
import { HTTPClient } from '../HTTPClient';
import { Theme } from '../themes/default';

interface State {
  message: string | null;
  uploadAirmen: File | null;
  uploadQualifications: File | null;
  uploadCertifications: File | null;
  attachAirmanCertifications: File | null;
  attachAirmanQualifications: File | null;
}

export class Upload extends React.Component<{}, State> {
  private timezone = moment.tz.guess();
  private client = new HTTPClient();
  private formMap = Object.freeze({
    'uploadAirmen': {title: 'Upload Airmen', url: '/api/upload/airmen'},
    'uploadCertifications': {title: 'Upload Certifications', url: '/api/upload/certifications'},
    'uploadQualifications': {title: 'Upload Qualifications', url: '/api/upload/qualifications'},
    'attachAirmanCertifications': {title: 'Attach Airman Certifications', url: '/api/upload/airmen/certifications'},
    'attachAirmanQualifications': {title: 'Attach Airman Qualifications', url: '/api/upload/airmen/qualifications'},
  });

  constructor(props: {}) {
    super(props);
    this.state = {
      message: null,
      uploadAirmen: null,
      uploadQualifications: null,
      uploadCertifications: null,
      attachAirmanCertifications: null,
      attachAirmanQualifications: null
    };
  }

  onSubmit = async (e: any) => {
    e.preventDefault();
    const name = e.target.name;
    const file = this.state[name];
    if (file == null) {
      return;
    }

    const resp = await this.client.postFile(this.formMap[name].url, file, this.timezone);
    if (resp.status < 200 || resp.status >= 300) {
      this.setState({message: 'Something went wrong with your .CSV upload.'});
    } else {
      this.setState({message: 'Successfully uploaded file.'});
    }
  }

  onChange = (e: any) => {
    this.setState({[e.target.name]: e.target.files[0]});
  }

  render() {
    const out = this.state.message ?
      [<h2 style={{background: Theme.yellow, color: Theme.darkest, padding: '1rem'}} key="0">{this.state.message}</h2>] :
      [];
    return out.concat(Object.keys(this.formMap).map((name: string, index: number) => {
      return (
        <div key={index + 1}>
          <h3>{this.formMap[name].title}</h3>
          <form name={name} onSubmit={this.onSubmit}>
          <input type="file" name={name} onChange={this.onChange}/>
          <input type="submit" value="Upload CSV"/>
        </form>
        </div>
      );
    }));
  }
}