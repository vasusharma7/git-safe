#!/usr/bin/env node
const shell = require("shelljs");
let pathToPackage = require("global-modules-path").getPath("git-safe");
shell.exec(`chmod +x ${pathToPackage}/git-safe.sh`);
switch (process.argv[2]) {
  case "encrypt": {
    shell.exec(`bash ${pathToPackage}/git-safe.sh encrypt ${pathToPackage}`);
    break;
  }
  case "decrypt": {
    shell.exec(`bash ${pathToPackage}/git-safe.sh decrypt ${pathToPackage}`);
    break;
  }
  case "commit": {
    shell.exec(`bash ${pathToPackage}/git-safe.sh commit ${pathToPackage}`);
    break;
  }
  default: {
    console.log(
      "[git-safe]: Only `git-safe encrypt | git-safe decrypt | git-safe commit` are supported !"
    );
  }
}
