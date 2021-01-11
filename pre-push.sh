my_array=( $(grep -r --exclude=exec.js -E -n "/\*[ ]git-safe[ ]\*/" * | cut -d : -f 1,2) )
echo ${#my_array[@]}

echo "${my_array[*]}"
node exec.js TrUMP ${my_array[*]}

#for element in "${my_array[@]}"
#do
#  echo "${element}"
#done

