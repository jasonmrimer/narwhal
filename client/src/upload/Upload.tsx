import * as React from 'react';
import * as Cookie from 'js-cookie';

export class Upload extends React.Component {
  render() {
    const csrfToken = Cookie.get('XSRF-TOKEN') || '';
    return [
      (
        <div key="0">
          <h3>Upload airmen: </h3>
          <form encType="multipart/form-data" method="post" action="/api/upload/airman">
            <input type="file" name="file"/>
            <input type="submit" value="Upload CSV"/>
            <input type="hidden" name="_csrf" value={csrfToken}/>
          </form>
        </div>
      ),
      (
        <div key="1">
          <h3>Upload qualifications: </h3>
          <form encType="multipart/form-data" method="post" action="/api/upload/qualification">
            <input type="file" name="file"/>
            <input type="submit" value="Upload CSV"/>
            <input type="hidden" name="_csrf" value={csrfToken}/>
          </form>
        </div>
      ),
      (
        <div key="2">
          <h3>Upload certifications: </h3>
          <form encType="multipart/form-data" method="post" action="/api/upload/certification">
            <input type="file" name="file"/>
            <input type="submit" value="Upload CSV"/>
            <input type="hidden" name="_csrf" value={csrfToken}/>
          </form>
        </div>
      ),
    ];
  }
}