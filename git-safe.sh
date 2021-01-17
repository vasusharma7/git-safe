#!/bin/bash

# To allow reading password typed by user
# Reference: https://stackoverflow.com/questions/48509786/shell-script-hangs-when-it-should-read-input-only-when-run-from-node-js 
exec </dev/tty

echo -n "Enter Password:";
read passkey

if [ "$passkey" == '' ]
then
  echo "[Fatal]: password required";
  exit 1;
fi

IFS=$'\n'
my_array=( $(grep -r --exclude-dir=node_modules --exclude=exec.js -E -n "\/\*\s*git-safe\s*\*\/" *) )
echo ${#my_array[@]}

echo "${my_array[*]}"
node $2/exec.js $1 $passkey ${my_array[*]}

case $? in 
  1)
  echo "[Fatal]: git-safe could not replace some lines"
  ;;

  2)
  echo "[Fatal]: git-safe passkey is incorrect"
  ;;
  0)
  echo "[Success]: Operation successfully completed"
  ;;
esac


