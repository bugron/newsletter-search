#!/bin/bash

for i in {1..324}
do
    echo "Downloading file for number $i"
    curl -o "$i.html" "https://bytes.dev/archives/$i"
    # Add a small delay to avoid overwhelming the server
    sleep $((RANDOM % 3 + 3))
done
