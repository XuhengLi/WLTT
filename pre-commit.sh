#!/bin/bash

node_modules/karma/bin/karma start my.conf.js --single-run --watch=false > karma.log

res=$(tail karma.log | grep FAIL | wc -c )

if [ $res != 0 ]
then
	echo 'Test Failed. See ./karma.log for details'
fi
exit $res
