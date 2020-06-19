import fetch from 'r2';
import { version } from '../../package.json';

export function postError({ error, info }) {
  const params = {
    method: 'POST',
    credentials: 'include',
    json: {
      message: error.message,
      stack: error.stack,
      url: document.URL,
      ...info
    }
  };

  return fetch('/error', params).response.catch(() => {});
}

export default function sendMessage({ method, data, url }) {
  const params = {
    method,
    credentials: 'include',
    // prevent auto-redirecting request
    // to keycloak if users session expires
    redirect: 'manual',
    json: data,
    headers: {
      // send version header for compatability validation on server
      'x-projects-version': version
    }
  };
  return Promise.resolve()
    .then(() => fetch(url, params).response)
    .then(response => {
      // detect if redirect was attempted
      if (response.type === 'opaqueredirect') {
        window.onbeforeunload = null;
        return window.location.reload();
      }
      return response.json()
        .then(json => {
          if (response.status > 399) {
            const err = new Error(json.message || `Action failed with status code: ${response.status}`);
            err.status = response.status;
            Object.assign(err, json);
            throw err;
          }
          return json;
        });
    });
}
