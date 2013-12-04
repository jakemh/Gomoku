#!/bin/bash
git add .
git commit -m "$1"
if $3 == true; then
	rake assets:precompile
fi 

git push $2 master
