#!/bin/bash

# Detect users running the script with "sh" instead of bash
if readlink /proc/$$/exe | grep -q "dash"; then
	echo "This script needs to be run with bash, not sh"
	exit
fi

# Check if we are running as root
if [[ "$EUID" -ne 0 ]]; then
	echo "Sorry, you need to run this as root"
	exit
fi

# Check what OS we are running on
if [[ "$OSTYPE" == "linux-gnu" ]]; then
    # Go into the temp dir
    cd /tmp

    # Download the latest version
    wget https://github.com/glenndehaan/ggpp/releases/latest/download/ggpp-linux -O ggpp-linux

    # Create the program dir
    mkdir -p /opt/ggpp

    # Move the binary to the installation directory
    mv ./ggpp-linux /opt/ggpp/ggpp-linux

    # Link the binary to the /usr/bin path
    ln -s /opt/ggpp/ggpp-linux /usr/bin/ggpp
elif [[ "$OSTYPE" == "darwin"* ]]; then
    # Go into the temp dir
    cd /tmp

    # Download the latest version
    wget https://github.com/glenndehaan/ggpp/releases/latest/download/ggpp-macos -O ggpp-macos

    # Create the program dir
    mkdir -p /opt/ggpp

    # Move the binary to the installation directory
    mv ./ggpp-linux /opt/ggpp/ggpp-macos

    # Link the binary to the /usr/bin path
    ln -s /opt/ggpp/ggpp-macos /usr/bin/ggpp
else
    echo "Sorry this script isn't compatible with your system"
fi
