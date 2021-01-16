#!/usr/bin/env node
const shell = require('shelljs');
switch (process.argv[2]) {
  case 'encrypt':
    {
      shell.exec('./git-safe.sh encrypt');
    }
    break;
  case 'decrypt':
    {
      shell.exec('./git-safe.sh decrypt');
    }
    break;
  case 'commit':
    {
      shell.exec('./git-safe.sh commit');
    }
    break;
  default: {
    console.log(
      '[git-safe]: Only `git-safe encrypt | git-safe decrypt | git-safe commit` are supported !'
    );
  }
}
