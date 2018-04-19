import * as Cookie from 'js-cookie';
import * as urljoin from 'url-join';

export class ErrorResponse {
  constructor(public message: string) {

  }
}

export class UnauthorizedErrorResponse extends ErrorResponse {

}

export class HTTPClient {
  private csrfToken: string = Cookie.get('XSRF-TOKEN') || '';

  constructor(private baseURL: string = '/') {
  }

  async getJSON(path: string) {
    const resp = await fetch(urljoin(this.baseURL, path), {credentials: 'include'});
    if (resp.status === 403) {
      return new UnauthorizedErrorResponse('You are not authorized to access this resource');
    }
    return await resp.json();
  }

  async postJSON(path: string, body: string) {
    const resp = await fetch(
      urljoin(this.baseURL, path),
      {
        method: 'POST',
        headers: [['Content-Type', 'application/json'], ['X-XSRF-TOKEN', this.csrfToken]],
        body: body,
        credentials: 'include'
      }
    );
    const json = await resp.json();
    if (resp.status < 200 || resp.status >= 300) {
      throw json;
    }
    return json;
  }

  async putJSON(path: string, body: string) {
    const resp = await fetch(
      urljoin(this.baseURL, path),
      {
        method: 'PUT',
        body: body,
        headers: [['Content-Type', 'application/json'], ['X-XSRF-TOKEN', this.csrfToken]],
        credentials: 'include',
      }
    );
    const json = await resp.json();
    if (resp.status < 200 || resp.status >= 300) {
      throw json;
    }
    return json;
  }

  async put(path: string) {
    const resp = await fetch(
      urljoin(this.baseURL, path),
      {
        method: 'PUT',
        headers: [['X-XSRF-TOKEN', this.csrfToken]],
        credentials: 'include',
      }
    );
    const json = await resp.json();
    if (resp.status < 200 || resp.status >= 300) {
      throw json;
    }
    return json;
  }

  async deleteJSON(path: string) {
    const resp = await fetch(
      urljoin(this.baseURL, path),
      {
        method: 'DELETE',
        headers: [['X-XSRF-TOKEN', this.csrfToken]],
        credentials: 'include'
      }
    );
    return await resp.json();
  }

  async delete(path: string, body?: string) {
    const resp = await fetch(
      urljoin(this.baseURL, path),
      {
        method: 'DELETE',
        body: body ? body : null,
        headers: [['Content-Type', 'application/json'], ['X-XSRF-TOKEN', this.csrfToken]],
        credentials: 'include'
      }
    );

    if (resp
      .status < 200 || resp.status >= 300) {
      throw new Error('Failed to delete item');
    }

  }

  async postFile(path: string, file: File, timezone: string) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('timezone', timezone);
    return await fetch(
      urljoin(this.baseURL, path),
      {
        method: 'POST',
        headers: [['X-XSRF-TOKEN', this.csrfToken]],
        body: formData,
        credentials: 'include'
      }
    );
  }
}
