#/bin/bash

if [ ! -d "../../.git" ] 
then
    git init ../../
fi

chmod +x pre-push.sh && cp pre-push.sh ../../.git/hooks/pre-push
