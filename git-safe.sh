#!/bin/bash
#echo -n "Enter Encryption Password:";
#read passkey
RED='\033[0;31m'
NC='\033[0m' # No Color
passkey="TruMp"
IFS=$'\n'
my_array=( $(grep -r --exclude-dir=node_modules -E -n "\/\*\s*git-safe\s*\*\/" *) )
if [[ ${#my_array[@]} -eq 0 ]]
then
  echo -e "[git-safe]: No files with ${RED}/* git-safe */${NC} comment found !"
  exit
fi
echo ${#my_array[@]}

echo "${my_array[*]}"
node $2/exec.js $1 $passkey ${my_array[*]}

case $? in 
  1)
  echo "[Fatal]: Something went wrong! git-safe could not replace some lines"
  ;;
  2)
  echo "[Fatal]: git-safe passkey is incorrect"
  ;;
  3)
  echo "[Fatal]: Error in decryption.Maybe you are decrypting unencrypted text !"
  ;;
  4)
  echo "[Fatal]: Error in /* git-safe */ comments. Only 1 comment found in a line."
  ;;
  0)
  echo "[Success]: Operation successfully completed"
  ;;
esac


