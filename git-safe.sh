#!/bin/bash
#echo -n "Enter Encryption Password:";
#read passkey
passkey="TruMP"
IFS=$'\n'
my_array=( $(grep -r --exclude-dir=node_modules -E -n "\/\*\s*git-safe\s*\*\/" *) )
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


