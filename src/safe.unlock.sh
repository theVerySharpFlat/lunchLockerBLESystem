#!/bin/bash
echo -n "UNLOCKING..."
export PATH_TO_STATUS_FILE=$1

#insert code to unlock the safe below



echo -n '01' >$PATH_TO_STATUS_FILE
exit 0