#!/usr/bin/env node
const shell = require("shelljs");
const { spawn } = require("child_process");
/*
 * add this to bashrc when installing
 * git() { $(echo $GITSAFE_PATH | grep -q -w $(pwd)) && git-safe "$@" || $(which git) "$@" }
 * and GITSAFE_PATH=()
 *
 *
 * Or run below block of code
 */

shell.exec(`echo "GITSAFE_PATH=()" >> ~/.bashrc`);
shell.exec(
  "echo 'git() { if [[ ${GITSAFE_PATH[@]} =~ $(pwd) ]] ; then git-safe " +
    '"$@"' +
    "; else $(which git) " +
    '"$@"' +
    " ;  fi }' >> ~/.bashrc "
);
shell.exec(`. ~/.bashrc`);

switch (process.argv[2]) {
  case "init": {
    let pathToPackage = require("global-modules-path").getPath("git-safe");

    //adding git-safe path as environment variable
    shell.exec(`echo "GITSAFE=${pathToPackage}" >> ~/.bashrc`);

    //adding path of current directory to git-safe paths in bashrc
    shell.exec('echo "GITSAFE_PATH+=($(pwd))" >> ~/.bashrc');

    //reloading bashrc to apply changes
    //this doesn't seem to work - for now bashrc has to be manually reloaded or new bash shell is to be created
    shell.exec(". ~/.bashrc");

    //neither does this work
    //spawn(".", ["~/.bashrc"], { shell: true, stdio: "inherit" });
    break;
  }
  default: {
    console.log("executing thru git-safe");
    //encrypt
    shell.exec("git " + process.argv.splice(2).join(" "));
    //console.log(process.argv.splice(2));
    //spawn("git", process.argv.splice(2), { shell: true, stdio: "inherit" });
    //decrypt
  }
}

//to do = change to one module shelljs or child process ! - decide with testing and features needed !
