#!/usr/bin/env node

const prompts = require('prompts');
const fs = require('fs');
const skynet = require('@nebulous/skynet');

const overwrite = async (file) => {
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
};

const deploy = async (directory) => {
  let url = await skynet.uploadDirectory(directory);
  url = url.toString().slice(6);
  return `Upload successful, url: https://siasky.net/${url}`;
};

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

  if (isSPW.value) {
    console.log('\nOverwriting index.html...');
    const isdone = await overwrite(`./${directory.value}/index.html`);
    if (isdone) {
      const url = await deploy(`./${directory.value}`);
      console.log(url);
    }
  } else {
    const url = await deploy(`./${directory.value}`);
    console.log(url);
  }
};

main();
