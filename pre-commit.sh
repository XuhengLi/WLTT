#!/bin/bash

res=$(node_modules/karma/bin/karma start my.conf.js --single-run --watch=false | grep -E "FAILED" | wc -w)

if [ $res != 0 ]
then
	echo 'Test Failed'
fi
exit $res
