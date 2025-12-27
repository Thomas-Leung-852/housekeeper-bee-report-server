#!/bin/bash

cd ../src
c_dir=$(pwd)

echo "========================================"
echo " Create Auto-run script after boot up   "
echo "========================================"

if [ ! -d ~/.config/autostart ]; then 
	sudo mkdir -p ~/.config/autostart
fi

sudo rm ~/.config/autostart/launch_housekeeper_bee_report_server.desktop 
sudo touch ~/.config/autostart/launch_housekeeper_bee_report_server.desktop

echo "[Desktop Entry]
Type=Application
Exec=gnome-terminal -- bash -c \"$c_dir/run.sh; exec bash\"
Hidden=false
NoDisplay=false
X-GNOME-Autostart-enabled=true
Name[C]=housekeeper bee report server
Name=housekeeper bee report server
Comment[C]=
Comment=
" | sudo tee -a  ~/.config/autostart/launch_housekeeper_bee_report_server.desktop >> /dev/null

echo "Done"


