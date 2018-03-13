import * as React from 'react';
import * as Cookie from 'js-cookie';
import * as moment from 'moment-timezone';

export class Upload extends React.Component {
  render() {
    const csrfToken = Cookie.get('XSRF-TOKEN') || '';
    return [
      (
        <div key="0">
          <h3>Upload Airmen: </h3>
          <form encType="multipart/form-data" method="post" action="/api/upload/airman">
            <input type="file" name="file"/>
            <input type="submit" value="Upload CSV"/>
            <input type="hidden" name="_csrf" value={csrfToken}/>
          </form>
        </div>
      ),
      (
        <div key="1">
          <h3>Upload Qualifications: </h3>
          <form encType="multipart/form-data" method="post" action="/api/upload/qualification">
            <input type="file" name="file"/>
            <input type="submit" value="Upload CSV"/>
            <input type="hidden" name="_csrf" value={csrfToken}/>
          </form>
        </div>
      ),
      (
        <div key="2">
          <h3>Upload Certifications: </h3>
          <form encType="multipart/form-data" method="post" action="/api/upload/certification">
            <input type="file" name="file"/>
            <input type="submit" value="Upload CSV"/>
            <input type="hidden" name="_csrf" value={csrfToken}/>
          </form>
        </div>
      ),
      (
        <div key="3">
          <h3>Attach Certifications to Airmen: </h3>
          <form encType="multipart/form-data" method="post" action="/api/upload/airmen/certifications">
            <input type="file" name="file"/>
            <input type="submit" value="Upload CSV"/>
            <input type="hidden" name="timezone" value={moment.tz.guess()} />
            <input type="hidden" name="_csrf" value={csrfToken}/>
          </form>
        </div>
      ),
      (
        <div key="4">
          <h3>Attach Qualifications to Airmen: </h3>
          <form encType="multipart/form-data" method="post" action="/api/upload/airmen/qualifications">
            <input type="file" name="file"/>
            <input type="submit" value="Upload CSV"/>
            <input type="hidden" name="timezone" value={moment.tz.guess()} />
            <input type="hidden" name="_csrf" value={csrfToken}/>
          </form>
        </div>
      )
    ];
  }
}