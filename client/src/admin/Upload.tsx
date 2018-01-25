import * as React from 'react';
import * as Cookie from 'js-cookie';

export default class Upload extends React.Component {
  render() {
    const csrfToken = Cookie.get('XSRF-TOKEN') || '';
    return (
      <form encType="multipart/form-data" method="post" action="/api/upload">
        <input type="file" name="file"/>
        <input type="submit" value="Upload CSV"/>
        <input type="hidden" name="_csrf" value={csrfToken}/>
      </form>
    );
  }
}