#!/bin/bash
FOLDER="./"

if [ $1 != "" ]
then
    FOLDER="$1/"
fi

for file in ./$FOLDER/*
do
    if [ ${file##*.} == "json" ]
    then
        echo ">> File $file"
        sudo ./testImg 0 $file
    fi
done