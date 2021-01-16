#!/bin/bash
#read -p "Enter Encryption Password:" password
pwd
passkey="TruMP"
IFS=$'\n'
my_array=( $(grep -r --exclude-dir=node_modules --exclude=exec.js -E -n "\/\*\s*git-safe\s*\*\/" *) )
echo ${#my_array[@]}

echo "${my_array[*]}"
node $2/exec.js $1 $passkey ${my_array[*]}

if [[ $? -eq 1 ]]
then
  echo "[Fatal]: git-safe exited with error"
elif [[ $? -eq 0 ]]
then
  echo "[Success]: all secrets successfuly encrypted"
fi


#for element in "${my_array[@]}"
#do
#  echo "${element}"
#done

