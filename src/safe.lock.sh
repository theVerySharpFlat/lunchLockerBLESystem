#!/bin/bash
echo -n "LOCKING..."
export PATH_TO_STATUS_FILE=$1
#insert code to lock the safe below 




echo -n '00' > $PATH_TO_STATUS_FILE
exit 0