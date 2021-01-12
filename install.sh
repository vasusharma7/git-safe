#/bin/bash

if [ ! -d "../../.git" ] 
then
    git init ../../
fi

chmod +x pre-commit.sh && cp pre-commit.sh ../../.git/hooks/pre-commit
