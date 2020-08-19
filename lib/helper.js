const fetch = require('node-fetch');
const fs = require('fs');
const skynet = require('@nebulous/skynet');

module.exports = {
  api: function (method, endpoint, body, accessKey, secretKey) {
    const credentials = Buffer.from(`${accessKey}:${secretKey}`);
    const encodedCredentials = credentials.toString('base64');
    const authorization = `Basic ${encodedCredentials}`;

    const options = {
      method,
      body,
      headers: {
        Authorization: authorization,
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    };
    const url = `https://namebase.io${endpoint}`;
    return fetch(url, options)
      .then((res) => res.json())
      .catch((err) => err);
  },

  overwrite: async function (file) {
    try {
      var data = fs.readFileSync(file, 'utf8');
      var result = data.split('href="/').join('href="./');
      result = result.split('src="/').join('src="./');
      try {
        fs.writeFileSync(file, result, 'utf8');
        return true;
      } catch (error) {
        console.log(error);
        return false;
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  },

  deploy: async function (directory) {
    let url = await skynet.uploadDirectory(directory);
    url = url.toString().slice(6);
    return url;
    // return `Upload successful, url: https://siasky.net/${url}`;
  }
};
