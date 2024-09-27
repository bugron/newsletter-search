#!/bin/bash

for i in {110..202}
do
    echo "Downloading file for number $i"
    curl -o "$i.html" "https://thisweekinreact.com/newsletter/$i"
    # Add a small delay to avoid overwhelming the server
    sleep $((RANDOM % 3 + 3))
done
