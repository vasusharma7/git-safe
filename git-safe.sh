#!/bin/bash
#read -p "Enter Encryption Password:" password
password="TruMP"
IFS=$'\n'
my_array=( $(grep -r --exclude-dir=node_modules --exclude=exec.js -E -n "\/\*\s*git-safe\s*\*\/" *) )
echo ${#my_array[@]}

echo "${my_array[*]}"
node exec.js $1 $password ${my_array[*]}

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

