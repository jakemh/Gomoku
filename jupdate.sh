#!/bin/bash

var=$(cat /Users/jh/Developer/ror/gomoku/tmp/pids/server.pid)
kill $var
echo "server killed"

cd /Users/jh/Developer/ror/gomoku/

rm -rf /Users/jh/Developer/ror/gomoku/gomokuproj2
cp -r /Users/jh/NetBeansProjects/GomokuProj2/src/gomokuproj2 /Users/jh/Developer/ror/gomoku/gomokuproj2
javac gomokuproj2/Gomokuproj2.java

echo "copied first set"
rm -rf /Users/jh/Developer/ror/gomoku/gomokuproj
cp -r /Users/jh/NetBeansProjects/GomokuProj/src/gomokuproj /Users/jh/Developer/ror/gomoku/gomokuproj
javac gomokuproj/Gomokuproj.java

echo "copied second set"

echo "setting up server..."

osascript <<END 
tell application "Terminal"
    do script "cd /Users/jh/Developer/ror/gomoku ; rails server trinidad" in front window
end tell
END
echo "server set up"