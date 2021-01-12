git add .
prev_message=$(git log -1 --pretty=%B)
new_message="modif: encrypted keys & ${message}"
git commit -m "$new_message" --no-verify 
