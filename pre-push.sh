res = ($(grep -r  -E -n "/\*[ ]git-safe[ ]\*/" * | cut -d : -f 1,2))
echo res
