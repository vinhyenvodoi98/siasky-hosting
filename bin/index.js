#!/usr/bin/env node

const prompts = require('prompts');
const { api, deploy, overwrite } = require('../lib/helper');

const main = async () => {
  console.log('=== Skynet Setup\n');

  const directory = await prompts({
    type: 'text',
    name: 'value',
    message: 'What do you want to use as your public directory?'
  });

  const isSPW = await prompts({
    type: 'confirm',
    name: 'value',
    message: 'Configure as a signle-page app (rewrite all urls to /index.html)?',
    initial: true
  });

  const isUseNb = await prompts({
    type: 'confirm',
    name: 'value',
    message: 'Wanna deploy web pages to Skynet using handshake domains ?',
    initial: true
  });

  if (isUseNb.value) {
    // Secret
    const accessKey = await prompts({
      type: 'text',
      name: 'value',
      message: 'Enter your ACCESS_KEY :'
    });

    const secretKey = await prompts({
      type: 'text',
      name: 'value',
      message: 'Enter your SECRET_KEY :'
    });

    const domain = await prompts({
      type: 'text',
      name: 'value',
      message: 'Enter your DOMAIN :'
    });
    if (isSPW.value) {
      console.log('\nOverwriting index.html...');
      await overwrite(`./${directory.value}/index.html`);
    }
    const url = await deploy(`./${directory.value}`);

    console.log('Waiting to deploy web pages to Skynet using handshake domains...');
    try {
      var body = `{"records": [{ "type": "TXT", "host": "", "value":"${url}","ttl": 0 }] }`;
      await api('PUT', `/api/v0/dns/domains/${domain}`, body, accessKey, secretKey);
      console.log('Deploy successfully ! Please wait for namebase to update your changes');
      console.log(`Instead, skylink : https://siasky.net/${url}`);
    } catch (error) {
      console.log(error);
    }
  } else {
    if (isSPW.value) {
      console.log('\nOverwriting index.html...');
      await overwrite(`./${directory.value}/index.html`);
    }
    const url = await deploy(`./${directory.value}`);
    console.log(`Upload successful, url: https://siasky.net/${url}`);
  }
};

main();
