#!/bin/sh

nohup node ./remote-mac-prefs-backend & &>/dev/null &
nohup node ./remote-mac-prefs-proxy & &>/dev/null &

exit 0
