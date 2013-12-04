#!/bin/bash

if $3 == true; then
	rake assets:precompile
fi 

git add .
git commit -m "$1"



git push $2 master
