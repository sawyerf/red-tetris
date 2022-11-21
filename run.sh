#!/bin/bash

if [ -f Dockerfile.$1 ]; then
	name="red-tetris-$1"
	docker pull node:latest
	docker build -t $name -f Dockerfile.$1 .
	docker run -t -p $2:$2 $3 $name
else
	echo "Wrong argument"
fi
