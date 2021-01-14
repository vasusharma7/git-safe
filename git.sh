git add .
prev_message=$(git log -1 --pretty=%B)
echo $prev_message
new_message="modif: encrypted keys & ${prev_message}"
git commit -m "$new_message" --no-verify 
