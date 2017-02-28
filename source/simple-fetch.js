import http from 'http';
import url from 'url';

// this is a very very basic fetch implementation
// to make it work in a node.js environment, without any
// dependency on 3rd party packages
module.exports = function(urlString) {

  const urlObject = url.parse(urlString);

  return new Promise((resolve, reject) => {
    http.get({
      hostname: urlObject.hostname,
      port: urlObject.port,
      path: urlObject.path,
      agent: false  // create a new agent just for this one request
    }, (response) => {
      if (response.statusCode > 299) {
        reject(response.statusMessage);
        return;
      }

      let str = '';
      response.on('data', function (chunk) {
        str += chunk;
      });

      response.on('end', function () {
        let jsObject = null;
        try {
          jsObject = JSON.parse(str);
        } catch(e) {
          // this is just to make eslint happy
          jsObject = null;
        }
        const json = () => Promise.resolve(jsObject);
        const text = () => Promise.resolve(str);
        const fetchResponse = {json, text};
        resolve(fetchResponse);
      });
    });
  });
};
